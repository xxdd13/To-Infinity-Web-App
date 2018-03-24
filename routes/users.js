var express = require('express');
var router = express.Router();
var db = require('../models/db');
/* GET users listing. */
router.get('/users/:id', function(req, res, next) {
    var nameList = new Array();
    for (i=0;i<10;i++){
      nameList.push(db.name.findName());
    }
    var userId = req.params.id;
    //var randomName = db.name.findName();

    //res.send(nameList[userId]);
    res.render('users.ejs', {
        title :'User List',
        userList :nameList,

    });
});

module.exports = router;
