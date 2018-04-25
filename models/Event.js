const mongoose = require('mongoose');
const Schema = mongoose.Schema

const Event = new Schema({
    title: {
        type: String,
    },
    image: {
        type: Buffer,
    },
    descripton:{
        type:String
    },
    location:{
        type:String
    },
    address:{
        type:String
    },
    creator:{
        type:Number,
        unique:true,
        indexed: true,
        required:true
    },
    prefLang:{
        type:String
    }
});

module.exports = mongoose.model('Event', Event)
