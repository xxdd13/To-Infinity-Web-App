const faker = require('../models/faker');
const User = require('../models/user');
const Event = require('../models/Event');
const Like = require('../models/Like');
const Join = require('../models/Join');
const mongoose = require('mongoose');
const fs = require('fs');

module.exports.index = function(req, res) {
    res.render('index',{user:((req.session.user)?(req.session.user): false),user: req.user});
    //res.render('index',null);


};

module.exports.users = function(req, res) {
    /* GET users listing. */
        res.render('users', {
            title :'User List',
            userList : faker,
            user:{user:((req.session.user)?(req.session.user): false)},
        });

};
module.exports.fetchAllPosts = function(req, res) {
    res.send("posts obj");
};

module.exports.needLogin = function(req, res) {
    return res.render('flogin', { user: null});
};




module.exports.login = function(req, res) {
    res.render('login',{user:((req.session.user)?(req.session.user): false)});
};

module.exports.loginReq = function(req, res,next) {
    // confirm that user typed same password twice
    if (req.body.password !== req.body.passwordConf) {
        var err = new Error('Passwords do not match.');
        err.status = 400;
        res.send("passwords dont match");
        return next(err);
    }

    if (req.body.email &&
        req.body.userName &&
        req.body.password &&
        req.body.passwordConf) {

        var userData = {
            email: req.body.email,
            username: req.body.userName,
            password: req.body.password,
            passwordConf: req.body.passwordConf,
        }

        User.create(userData, function (error, user) {
            if (error) {

                return next(error);
            } else {
                req.session.userId = user._id;
                return res.redirect('/profile');
            }
        });

    } else if (req.body.logemail && req.body.logpassword) {
        User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
            if (error || !user) {
                var err = new Error('Wrong email or password.');
                err.status = 401;
                return next(err);
            } else {
                req.session.userId = user._id;
                req.session.user = user;
                //console.log(user);
                res.redirect('/');
            }
        });
    } else {
        var err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }
};


module.exports.profile = function(req, res) {


    User.findById(req.session.passport.user, function(err, user) {

        // Error
        if(err) {
            console.log(err);

        } else {
            Join.find({oauthID:req.user.oauthID}, function(err, joins) {

                // Error
                if(err) {
                    console.log(err);

                } else {

                    res.render('profile', { user: user,joins:joins});
                }
            });

        }
    });




};


module.exports.logout = function(req, res) {
    if (req.session) {
        // delete session object
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
        });
    }
};

module.exports.deleteAll = function(req, res) {
    User.remove({}, function(err) {
        console.log('collection removed');
        User.collection.dropIndexes();
        User.collection.drop();
    });
};


module.exports.deleteAll = function(req, res) {
    User.remove({}, function(err) {
        console.log('collection removed');
        User.collection.dropIndexes();
        User.collection.drop();
    });
};



module.exports.eventX = function(req, res) {
    var myEvents = [];
    var myLikes=[];
    Event.find({}).sort({'created': 'desc'}).exec(function(err, events) {
        if (!err){
            Join.find({oauthID:req.user.oauthID}, function(err, joinedEvents) {
                for (var i in joinedEvents) {
                    myEvents.push(joinedEvents[i].eventID);
                }
                Like.find({oauthID:req.user.oauthID}, function(err, liked) {
                    for (var j in liked) {
                        myLikes.push(liked[j].eventID);

                    }

                    res.render('eventX', { user: req.user, events:events,myEvents:myEvents,myLikes:myLikes});
                });

            });

        } else {throw err;}
    });
};

module.exports.event = function(req, res) {
    var eventID = req.params.eventID
    if(!req.params.eventID){
        return res.send("no ID provided");
    }
    User.findById(req.session.passport.user, function(err, user) {
        if(err) {
            console.log(err);
        } else {

            Event.findById(eventID, function(err, event) {
                if(err) {
                    console.log(err);
                } else {
                    if (event!=null){

                        Join.find({eventID:eventID},function(err, joins) {
                            if(err) {
                                console.log(err);
                            } else {

                                var userInEvent = [];
                                joins.forEach(function(j) {
                                    userInEvent.push(j.oauthID);
                                });
                                User.find({
                                    'oauthID': { $in: userInEvent}
                                }, function(err, users){

                                    User.findOne({oauthID: event.creator}, function(err, creator){
                                        console.log(creator.name)
                                        console.log(creator)
                                        res.render('event', { user: user, event,event,userInEvent:users,creator:creator});
                                    });

                                });
                            }
                        });

                    }else{
                        res.send("Invalid Event ID");
                    }


                }
            });
        }
    });


};


module.exports.create_event = function(req, res,next) {


    User.findById(req.session.passport.user, function(err, user) {
        if(err) {
            console.log(err);
        } else {
            res.render('createEvent', { user: user});
        }
    });
};
module.exports.deleteEvents = function(req, res) {
    Event.collection.dropIndexes();
    Event.collection.drop();
    Join.collection.dropIndexes();
    Join.collection.drop();
};
module.exports.deleteLikes = function(req, res) {
    Like.collection.dropIndexes();
    Like.collection.drop();
};


module.exports.imgid = function(req, res) {
    var id = req.params.id
    Event.findById(id).then((result) => {
        //res.render('pic', {text : result.text, image : result.image});
        res.send(result.image);
    }).catch((e) =>  res.send(e) );
};

module.exports.create = function(req, res) {
    if(1>0 || "lady gaga is the best artist"){

        var event = new Event({
            title: req.body.title,
            image: fs.readFileSync(req.file.path),
            description:req.body.description,
            location: req.body.location,
            creator:req.user.oauthID,
            prefLang :req.body.prefLang,

        });

        event.save(function (err, eve) {
            event.save().then((result) => {
                var join = new Join({
                    oauthID: req.user.oauthID,
                    eventID: eve._id
                });
                join.save(function (err, eve) {
                    res.redirect("/eventX");
                });
            });

        });
    }
};

module.exports.joinList = function(req, res) {
    Join.find({}, function(err, join) {

        // Error
        if(err) {
            console.log(err);

        } else {
            res.send(join);
        }
    });

};

module.exports.join = function(req, res) {
    var join = new Join({
        oauthID: req.user.oauthID,
        eventID: req.body.eventID
    });
    join.save(function (err, eve) {
        res.redirect("/eventX");
    });
};



module.exports.updatebio = function(req, res) {
    var text = req.body.bio


    User.update({_id: req.session.passport.user}, { bio: text}, { multi: true }, function (err, result) {
        res.redirect("/profile")
    })

};

module.exports.quitEvent = function(req, res) {
    var eventID = req.body.eventID

    Join.findOneAndRemove({eventID:eventID,oauthID:req.user.oauthID}, function(err,data)
    {
        if(!err){
            console.log("Deleted");
            res.redirect("/eventX");
        }
    });


};



module.exports.like = function(req, res) {
    req.on('data', function(chunk) {

        var id = chunk.toString();//eventID
        var likeID=String(req.user.oauthID)+id;
        Like.findOne({oauthEventID: likeID}, function (err, like) {

            Event.findOne({_id: mongoose.Types.ObjectId(id)}, function (err, event) {
                var num = event.likes;


                if(like == null || !like){//never liked this event
                    if(num==null || !num){num=1}
                    else{num+=1;};
                    var newLike = new Like({
                        oauthEventID: likeID,
                        oauthID:req.user.oauthID,
                        eventID:id
                    });
                    newLike.save(function (err, save) {
                        Event.update({_id: mongoose.Types.ObjectId(id)}, { likes: num}, { multi: false }, function (err, result) {
                            console.log("number of likes " +num)
                            res.setHeader('Content-Type', 'text/html');
                            res.writeHead(200);
                            res.end(String(num));
                        });
                    });

                }
                else{
                    console.log("user already liked");
                    if(num==null || !num){num=0}
                    res.setHeader('Content-Type', 'text/html');
                    res.writeHead(200);
                    res.end(String(num));
                }


            });
        });


    });
};