// These three required for the fs.readdirSync()
const fs = require('fs');
const { Client, MessageAttachment } = require('discord.js');

const winston = require('winston');

const MemeManager = function MemeManager(bot) {
  // initialize cena
  const cenaImageFolder = './modules/cenaImages/';
  let cenaImageArray = [];
  // Loops through a given folder and creates an array of file names
  cenaImageArray = fs.readdirSync(cenaImageFolder);

  // cena reply function
  this.cenaReply = function cenaReply(message) {
    // Get random image path from array
    const randomIndex = Math.floor(Math.random() * cenaImageArray.length);
    const randomCenaImageFilePath = cenaImageArray[randomIndex];

    // \uD83C is the unicode trumpet
    this.MemeReply(message,
      '\uD83C\uDFBA\uD83C\uDFBA\uD83C\uDFBA\uD83C\uDFBA**JOHN CENA!**\uD83C\uDFBA\uD83C\uDFBA\uD83C\uDFBA\uD83C\uDFBA',
      cenaImageFolder.concat(randomCenaImageFilePath),
      'SUPERSLAM!');
  };

  // KoolAid reply function
  this.koolaidReply = function koolaidReply(message) {
    this.MemeReply(message,
      'Oh Yeah!',
      './modules/memeImages/koolaid.jpg',
      'with Kool Aid');
  };

  // Macho Man function
  this.machoManReply = function machoManReply(message) {
    this.MemeReply(message,
      'Ohhhh yeah brother!',
      './modules/memeImages/savage.jpg',
      'with Randall');
  };

  // Tiny Rick function
  this.tinyRickReply = function tinyRickReply(message) {
    this.MemeReply(message,
      "I'm Tiny Rick!!!!!",
      './modules/memeImages/tinyRick.jpg',
      'with Rick Sanchez');
  };

  // Utility function to make future Discord JS Upgrades "easier"
  this.MemeReply = function MemeReply(message, response, imagePath, presence) {
    const attachment = new MessageAttachment(imagePath);
    message.reply(response, attachment).catch((err) => winston.error("couldn't send image", err));
    bot.user.setPresence({ activity: { name: presence, type: 0 } });
  };
};

module.exports = MemeManager;
