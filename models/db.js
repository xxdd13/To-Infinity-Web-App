var faker = require('faker');
var randomName = faker.name.findName(); // Rowan Nikolaus
var randomEmail = faker.internet.email(); // Kassandra.Haley@erich.biz
var randomCard = faker.helpers.createCard(); // random contact card containing many properties
var userList=[];


for (i=0;i<10;i++){
    var user = {
        name:faker.fake("{{name.lastName}}  {{name.firstName}} {{name.suffix}}"),
        bio:faker.fake("{{lorem.sentence}}"),
        avatar:faker.fake("{{image.avatar}}")
    };
    userList.push(user);
}

module.exports= userList;