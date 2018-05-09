var mongoose = require('mongoose');
/*many to many relationship of user joins events*/
var JoinSchema = new mongoose.Schema({
    oauthID:{
        type:Number,
        unique: false,
        index:false
    },
    created: { type: Date, default: Date.now },
    eventID:{type:String}
});



var Join = mongoose.model('Join', JoinSchema);
module.exports = Join;

