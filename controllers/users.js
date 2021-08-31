const User = require('../models/user');


module.exports.renderRegister = (req, res) => {
    res.render('users/register')
};

module.exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
};

module.exports.renderLogin = (req, res) => {
    res.render('../views/users/login')
};

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    //If there is no req.session.returnTo go to /campgrounds
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/campgrounds');
    }
    req.logout();
    req.flash('success', 'Bye');
    res.redirect('/campgrounds');
};