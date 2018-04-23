var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('./models/user.js');
var config = require('./configuration/config.js');


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
                console.log("found user   "+user.OauthID);

                // save it in session
                done(null, user);

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


/*
<p>ID: <%= user.id %></p>
<p>Username: <%= user.username %></p>
<p>Name :<%= user.displayName %></p>
*/
