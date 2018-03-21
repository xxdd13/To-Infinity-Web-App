const express = require('express')
const app = express()

var uri = "mongodb+srv://info30005thursday:XXDD1300!!@cluster0-rcw4z.mongodb.net/test";

var MongoClient = require('mongodb').MongoClient;

var mongoose = require('mongoose');
mongoose.connect(uri);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("we're connected!")
});


var xxddSchema = mongoose.Schema({
    name: String
});

var xxdd = mongoose.model('xxdd', xxddSchema);

var xxdd1 = new xxdd({ name: 'xdd1' });
console.log(xxdd1.name); // 'Silence'

/*
MongoClient.connect(uri, function(err, client) {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    client.close();
});
*/

//app.set('view engine', 'pug')
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');



app.get('/', function(req, res) {
    res.render('index');
});

app.get('/m',function(req,res){

    var MongoClient = require('mongodb').MongoClient

    var URL = 'mongodb://localhost:27017/mydatabase'

    MongoClient.connect(URL, function(err, db) {s
        if (err) return

        var collection = db.collection('foods')
        collection.insert({name: 'taco', tasty: true}, function(err, result) {
            collection.find({name: 'taco'}).toArray(function(err, docs) {
                console.log(docs[0])
                db.close()
            })
        })
    })

});

app.get('/i',function(req,res){

     res.sendFile(__dirname + '/interviewguide.html');

});


app.listen(3000);

console.log("Running at Port 3000");

