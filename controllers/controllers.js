var db = require('../models/db');

module.exports.users = function(req, res) {
    /* GET users listing. */

        res.render('users', {
            title :'User List',
            userList : db,

        });


};
module.exports.fetchAllPosts = function(req, res) {
    res.send("posts obj");
};

/*
module.exports.fetchPost = function(req, res) {
    constpost = posts[req.params.id];
    res.render('post_template', {
        post: post
    });
};
*/