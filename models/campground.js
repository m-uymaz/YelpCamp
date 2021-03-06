const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;
const User = require('./user');

const imageSchema = new Schema({
    url: String,
    filename: String
})

imageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200');
})

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
    title: String,
    images: [imageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: {
        type: Number,
        min: 10,
        max: 15000
    },
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: User
    },
    usersReviewed: [{
        type: String
    }],
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: Review
    }]
}, opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function() {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0, 20)}</p>`
});

//Below will be triggered by findByIdAndUpdate()
CampgroundSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
});

module.exports = mongoose.model('Campground', CampgroundSchema);