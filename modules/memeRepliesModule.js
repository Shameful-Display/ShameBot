// These three required for the fs.readdirSync()
const fs = require('fs');
const { Client, MessageAttachment } = require('discord.js');

const winston = require('winston');

const MemeManager = function (bot) {
  // initialize cena
  const cenaImageFolder = './modules/cenaImages/';
  let cenaImageArray = new Array();
  cenaImageArray = fs.readdirSync(cenaImageFolder); // Loops through a given folder and creates an array of file names

  // cena reply function
  this.cenaReply = function (message) {
    // Get random image path from array
    const randomCenaImageFilePath = cenaImageArray[Math.floor(Math.random() * cenaImageArray.length)];

    // \uD83C is the unicode trumpet
    this.MemeReply(message,
      '\uD83C\uDFBA\uD83C\uDFBA\uD83C\uDFBA\uD83C\uDFBA**JOHN CENA!**\uD83C\uDFBA\uD83C\uDFBA\uD83C\uDFBA\uD83C\uDFBA',
      cenaImageFolder.concat(randomCenaImageFilePath),
      'SUPERSLAM!');
  };

  // KoolAid reply function
  this.koolaidReply = function (message) {
    this.MemeReply(message,
      'Oh Yeah!',
      './modules/memeImages/koolaid.jpg',
      'with Kool Aid');
  };

  // Macho Man function
  this.machoManReply = function (message) {
    this.MemeReply(message,
      'Ohhhh yeah brother!',
      './modules/memeImages/savage.jpg',
      'with Randall');
  };

  // Tiny Rick function
  this.tinyRickReply = function (message) {
    this.MemeReply(message,
      "I'm Tiny Rick!!!!!",
      './modules/memeImages/tinyRick.jpg',
      'with Rick Sanchez');
  };

  // Utility function to make future Discord JS Upgrades "easier"
  this.MemeReply = function (message, response, imagePath, presence) {
    const attachment = new MessageAttachment(imagePath);
    message.reply(response, attachment).catch((err) => winston.error("couldn't send image", err));
    bot.user.setPresence({ activity: { name: presence, type: 0 } });
  };
};

module.exports = MemeManager;
