var mongoose = require('mongoose');
/*many to many relationship of user likes events*/
var LikeSchema = new mongoose.Schema({
    oauthEventID:{
        type:String
    },
    oauthID:{
        type:String
    },
    eventID:{
        type:String
    },
    created: { type: Date, default: Date.now }
});

var Like = mongoose.model('Like', LikeSchema);
module.exports = Like;

