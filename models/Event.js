const mongoose = require('mongoose');
const Schema = mongoose.Schema

const Event = new Schema({
    title: {
        type: String,
    },
    created: { type: Date, default: Date.now },
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
        unique:false,
        indexed: false,
        required:true
    },
    prefLang:{
        type:String
    },
    likes:{
        type:Number,default: 0
    },
    going:{
        type:Number,default: 1
    },

});

module.exports = mongoose.model('Event', Event)
