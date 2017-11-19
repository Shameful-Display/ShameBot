//These three required for the fs.readdirSync()
var fs = require( "fs" );
var path = require( "path" );
var process = require( "process" );

var winston = require('winston');

var MemeManager = function (bot){
  //initialize cena
  var cenaImageFolder = "./modules/cenaImages/";
  var cenaImageArray = new Array();
  cenaImageArray = fs.readdirSync(cenaImageFolder); //Loops through a given folder and creates an array of file names

  //cena reply function
  this.cenaReply = function (message) {
    //Reply message - \uD83C is the unicode trumpet
    message.reply("\uD83C\uDFBA\uD83C\uDFBA\uD83C\uDFBA\uD83C\uDFBA**JOHN CENA!**\uD83C\uDFBA\uD83C\uDFBA\uD83C\uDFBA\uD83C\uDFBA");
    //Get random image path from array
    var randomCenaImageFilePath = cenaImageArray[Math.floor(Math.random() * cenaImageArray.length)];
    //Reply with random cena image
    message.channel.sendFile(cenaImageFolder.concat(randomCenaImageFilePath),"jonny.png")
      .catch((err) => winston.error("couldn't send image:", err));
  }

  //KoolAid reply function
  this.koolaidReply = function (message){
    message.channel.sendFile("./modules/memeImages/koolaid.jpg","koolaid.jpg")
      .catch((err) => winston.error("couldn't send image:", err));
  }

  //Macho Man function
  this.machoManReply = function (message){
    message.reply("Ohhhh yeah brother!");
		message.channel.sendFile("./modules/memeImages/savage.jpg","savage.jpg")
			.catch((err) => winston.error("Couldn't send image:", err));
  }

  //Tiny Rick function
  this.tinyRickReply = function (message) {
    message.reply("I'm Tiny Rick!!!!!");
    message.channel.sendFile("./modules/memeImages/tinyRick.jpg","tinyRick.jpg")
      .catch((err) => winston.error("couldn't send image:", err));
  }

}

module.exports = MemeManager;
