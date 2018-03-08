const express = require('express')
const app = express()
app.set('view engine', 'pug')




app.get('/', function (req, res) {
  res.render('index', { title: 'SS', message: '2018' })
})

app.get('/r',function(req,res){

     res.sendFile(__dirname + '/index.html');

});

app.get('/i',function(req,res){

     res.sendFile(__dirname + '/interviewguide.html');

});


app.listen(3000);

console.log("Running at Port 3000");
