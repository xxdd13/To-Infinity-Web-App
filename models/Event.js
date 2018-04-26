const mongoose = require('mongoose');
const Schema = mongoose.Schema

const Event = new Schema({
    title: {
        type: String,
    },
    image: {
        type: Buffer,
    },
    description:{
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
    },
    likes:{
        type:Number
    },
    going:{
        type:Number
    },

});

module.exports = mongoose.model('Event', Event)
