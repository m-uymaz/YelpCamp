const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//passport-local-mongoose is for the Schema???
const passportLocalMongoose = require('passport-local-mongoose');

// must be "email:"
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});
//below gives userSchema the password hashed and salted!
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);