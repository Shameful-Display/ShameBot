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
    //Get random image path from array
    var randomCenaImageFilePath = cenaImageArray[Math.floor(Math.random() * cenaImageArray.length)];

    // \uD83C is the unicode trumpet
    this.MemeReply(message,
      "\uD83C\uDFBA\uD83C\uDFBA\uD83C\uDFBA\uD83C\uDFBA**JOHN CENA!**\uD83C\uDFBA\uD83C\uDFBA\uD83C\uDFBA\uD83C\uDFBA",
      cenaImageFolder.concat(randomCenaImageFilePath)
    )
  }

  //KoolAid reply function
  this.koolaidReply = function (message){
    this.MemeReply(message,
      "Oh Yeah!",
      "./modules/memeImages/koolaid.jpg")
  }

  //Macho Man function
  this.machoManReply = function (message){
    this.MemeReply(message,
      "Ohhhh yeah brother!",
      "./modules/memeImages/savage.jpg")
  }

  //Tiny Rick function
  this.tinyRickReply = function (message) {
    this.MemeReply(message,
      "I'm Tiny Rick!!!!!",
      "./modules/memeImages/tinyRick.jpg")
  }

  // Utility function to make future Discord JS Upgrades "easier"
  this.MemeReply = function (message, response, imagePath) {
    message.reply(response, {
      file: imagePath
    }).catch((err) => winston.error("couldn't send image", err));
  }
}

module.exports = MemeManager;
