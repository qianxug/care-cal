const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    UID: String,
    Care: Boolean,
    Name: String,
    Email: String,
    Products: [],
    Schedule: []
});

const User = mongoose.model('User', userSchema)
module.exports = User;