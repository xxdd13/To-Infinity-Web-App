const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const InstagramStrategy = require('passport-instagram').Strategy
const User = require('./models/user.js');
const config = require('./configuration/config.js');


module.exports = passport.use(new FacebookStrategy({
    // Import from Config.js
    clientID: config.facebook_api_key,
    clientSecret:config.facebook_api_secret ,
    callbackURL: config.callback_url,

    // Asking FB for the profileField data
    profileFields:['id','displayName','email', 'name', 'gender', 'picture.type(large)']
},

    // Getting from FB
    function(accessToken, refreshToken, profile, done) {

        // find by ID
        // oauthID (ID from FB)
        User.findOne({ oauthID: profile.id }, function(err, user) {
            if(err) {
                console.log("user fond one error "+err);  // handle errors!
            }
            // Find a User
            if (!err && user !== null) {
                User.update({oauthID: profile.id}, { avatar: profile.photos ? profile.photos[0].value : '/img/faces/unknown-user-pic.jpg'}, { multi: false }, function (err, result) {
                    done(null, user);
                })
                // save it in session


            // First time User
            } else {

                // New User Object
                user = new User({
                    oauthID: profile.id,
                    name: profile.displayName,
                    created: Date.now(),
                    avatar: profile.photos ? profile.photos[0].value : '/img/faces/unknown-user-pic.jpg'
                });

                // Save it in mongoose model
                user.save(function(err) {
                    if(err) {
                        console.log("user save error "+ err);  // handle errors!
                    } else {
                        console.log("saving user ..." +user.name +user.oauthID);

                        // save it in session
                        done(null, user);
                    }
                });
            }
        });
    }
));

passport.use(new InstagramStrategy({
        clientID:  config.INSTAGRAM_CLIENT_ID,
        clientSecret:  config.INSTAGRAM_CLIENT_SECRET,
        callbackURL: config.callback_url_ig
    },
    function(accessToken, refreshToken, profile, done) {
        console.log(profile)
        User.findOne({ oauthID: profile.id }, function(err, user) {
            if(err) {
                console.log("user fond one error "+err);  // handle errors!
            }
            if (!err && user !== null) {

                const newAvatar = profile._json.data.profile_picture ? profile._json.data.profile_picture : '/images/faces/unknown-user-pic.jpg';
                console.log(profile._json.data.profile_picture)
                User.update({oauthID: profile.id}, { avatar: newAvatar},{ multi: false }, function (err, result) {
                    done(null, user);
                });
            } else {
                user = new User({
                    oauthID: profile.id,
                    name: profile.displayName,
                    created: Date.now(),
                    bio: profile.bio,
                    avatar:profile.profile_picture ? profile.profile_picture : '/images/faces/unknown-user-pic.jpg'
                });
                user.save(function(err) {
                    if(err) {
                        console.log("user save error "+ err);  // handle errors!
                    } else {
                        done(null, user);
                    }
                });
            }
        });
    }
));

