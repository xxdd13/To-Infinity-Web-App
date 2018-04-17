var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('./models/user.js');
var config = require('./configuration/config.js');

module.exports = passport.use(new FacebookStrategy({
        clientID: config.facebook_api_key,
        clientSecret:config.facebook_api_secret ,
        callbackURL: config.callback_url,
        profileFields:['id','displayName','email', 'name', 'gender', 'picture.type(large)']
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOne({ oauthID: profile.id }, function(err, user) {
            if(err) {
                console.log(err);  // handle errors!
            }
            if (!err && user !== null) {
                console.log("found user   "+user.OauthID);
                done(null, user);
            } else {
                user = new User({
                    oauthID: profile.id,
                    //email:profile.email,
                    name: profile.displayName,
                    created: Date.now(),
                    avatar: profile.photos ? profile.photos[0].value : '/img/faces/unknown-user-pic.jpg'
                });
                user.save(function(err) {
                    if(err) {
                        console.log(err);  // handle errors!
                    } else {
                        console.log("saving user ..." +user.displayName);

                        done(null, user);
                    }
                });
            }
        });
    }
));
