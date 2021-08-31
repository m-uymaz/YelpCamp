const mongoose = require('mongoose');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers')
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
})

const emptyCampgrounds = async() => await Campground.deleteMany({});

const sample = array => array[Math.floor(Math.random() * array.length)];

let image = 'https://source.unsplash.com/collection/483251/1600x900';

const seedDB = async() => {
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000) + 1;
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Campground({
            author: Math.random() < 0.5 ? "60ff940dfc8bb54c40dca3bf" : "60fc8b5dfbb84f10209725ce",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit.',
            price,
            images: [{
                    url: 'https://res.cloudinary.com/lemish/image/upload/v1628301782/YelpCamp/zyby5oqkewjglnhmgtnm.jpg',
                    filename: 'YelpCamp/zyby5oqkewjglnhmgtnm'
                },
                {
                    url: 'https://res.cloudinary.com/lemish/image/upload/v1628301782/YelpCamp/k1yzcpzmfslbmsailhgb.jpg',
                    filename: 'YelpCamp/k1yzcpzmfslbmsailhgb'
                }
            ],
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ],
            }
        })
        await camp.save();
    }
}

const deleteAndReplace = async() => await emptyCampgrounds().then(() => seedDB().then(() => mongoose.connection.close()));

deleteAndReplace();