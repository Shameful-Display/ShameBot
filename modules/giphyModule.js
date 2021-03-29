const queryString = require('querystring');
const winston = require('winston');
const request = require('request');
const AuthDetails = require('../auth.json');

const GiphyManager = function giphyManager() {
  this.search = function search(message) {
    const searchTerm = queryString.escape(message.cleanContent.replace('!gif', ''));
    const giphyAPIUrl = `http://api.giphy.com/v1/gifs/search?q=${searchTerm}&api_key=${AuthDetails.giphyAPIKey}&limit=1`;
    request(giphyAPIUrl, (err, response, body) => {
      const imageData = JSON.parse(body).data;
      if (imageData.length > 0) {
        message.channel.send(imageData[0].embed_url);
      } else {
        message.reply(`*${message.cleanContent.replace('!gif ', '')}*\n`, {
          file: './memeImages/mimic.png',
        }).catch((err) => winston.error("couldn't send image", err));
      }
    });
  };
};

module.exports = GiphyManager;
