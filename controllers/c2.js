const faker = require('../models/faker');
const User = require('../models/user');
module.exports.index = function(req, res) {
    res.render('index',{user:'1'});
};
