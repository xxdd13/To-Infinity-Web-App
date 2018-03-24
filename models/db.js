var faker = require('faker');
var randomName = faker.name.findName(); // Rowan Nikolaus
var randomEmail = faker.internet.email(); // Kassandra.Haley@erich.biz
var randomCard = faker.helpers.createCard(); // random contact card containing many properties
var nameList=[];

for (i=0;i<10;i++){
    nameList.push(faker.name.findName());
}

module.exports= nameList;