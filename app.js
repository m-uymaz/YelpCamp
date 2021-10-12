// If we are in development, require .env pacage,
// which is going to take the variables in .env file
// and add the files to process.env.NODE_ENV
// NODE_ENV - environment varieble
// console.log(process.env.SECRET);
// if (process.env.NODE_ENV !== 'production') {
//     require('dotenv').config();
// }
require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
// mongoSanitize = Mongo inection (hack)
const mongoSanitize = require('express-mongo-sanitize');
// All other hacks
const helmet = require('helmet');

const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');

//Requireing routers
const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Get Body Info
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// app.use(express.static('public')); --- OLD CODE
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize())

//Session is for the information on the cookie
const MongoDBStore = require('connect-mongo');

const secret = process.env.SECRET || 'thisshouldbeabettersecret'

app.use(session(sessionConfig = {
    name: 'fb_',
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure = coockies can only be configured over secured connections
        // secure: true,
        //When the coockie will expire in miliseconds
        // the below makes -> sec, min, hour, day, week
        expires: Date.now() + 1000 * 60 * 60 * 24 * 5
    },
    store: MongoDBStore.create({
        mongoUrl: dbUrl,
        secret: secret,
        touchAfter: 24 * 3600
    })
}));
// Flash
app.use(flash());
// contentSecurityPolicy authenticates diffrent links with scripts,
// set to false so that they don't break stuff
app.use(helmet({ contentSecurityPolicy: false }));

app.use(passport.initialize());
app.use(passport.session());
// LocalStrategy is const LocalStrategy = require('passport-local');
//bellow -> use the LocalStrategy & athentication method is on User model
passport.use(new LocalStrategy(User.authenticate()));


//serializeUser -> how do we store user in the session (cookie)
passport.serializeUser(User.serializeUser());
//deserializeUser -> how to delete the user from the session (cookie)
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    //res.locals.success saves in res.locals under the key "success"
    // You can use <%= success %> in "boilerplate", for example
    // IMPORTANT -> RES/REQ.LOCALS IF FOR VIEW ENGINE - EJS, TO SEE!!!
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// app.get('/fakeuser', async (req, res) => {
//     const user = new User({ email: 'mish@gmail.com', username: 'mishoxx' });
//     const newUser = await User.register(user, 'monkey');
//     res.send(newUser);
// })

//Routers!
app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.get('/', (req, res) => {
    res.render('home')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`);
})