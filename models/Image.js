const mongoose = require('mongoose');
const Schema = mongoose.Schema

const Image = new Schema({
    text: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
});

module.exports = mongoose.model('Image', Image)
