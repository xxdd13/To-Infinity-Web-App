var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
    oauthID:{
        type:Number,
        unique: true,
        index:true
    },
    created: { type: Date, default: Date.now },
    email: {
        type: String,
        unique: false,
        required: false
    },
    username: {
        type: String,
        unique: false,
        required: false
    },
    name: {
        type: String,
        unique: false,
        required: false,
        trim: true
    },
    location: {
        type: String,
        unique: false,
        required: false,
        trim: true
    },
    bio: {
        type: String,
        unique: false,
        required: false,
        trim: true
    },
    password: {
        type: String,
        required: false,
    },
    passwordConf: {
        type: String,
        required: false,
    },
    avatar:{
        type:String
    }

});


/*
//authenticate input against database
UserSchema.statics.authenticate = function (email, password, callback) {
    User.findOne({ email: email })
        .exec(function (err, user) {
            if (err) {
                return callback(err)
            } else if (!user) {
                var err = new Error('User not found.');
                err.status = 401;
                return callback(err);
            }
            bcrypt.compare(password, user.password, function (err, result) {
                if (result === true) {
                    return callback(null, user);
                } else {
                    return callback();
                }
            })
        });
}

//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    })
});

*/
var User = mongoose.model('User', UserSchema);
module.exports = User;

