var mongoose = require('mongoose');
/*many to many relationship of user likes events*/
var LikeSchema = new mongoose.Schema({
    oauthEventID:{
        type:String,
        index:true
    },
    oauthID:{
        type:String,
        index:true
    },
    eventID:{
        type:String,
        index:true
    },
    created: { type: Date, default: Date.now }
});

var Like = mongoose.model('Like', LikeSchema);
module.exports = Like;

