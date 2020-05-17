var fs = require( "fs" );
var path = require( "path" );
var process = require( "process" );
var request = require("request");
var querystring = require('querystring')
var AuthDetails = require("../auth.json");
const { Client, MessageEmbed } = require('discord.js');

const rapidAPIURL = "https://alpha-vantage.p.rapidapi.com/query";
const rapidAPIHost = "alpha-vantage.p.rapidapi.com";

var financeEmbedBuilder = function (symbol, message) {
  var greenColor = "0x33FF00"
  var redColor = "0xCC0000"
  var neutralColor = "0x99FFFF"
  var color = neutralColor;

  const embed = new MessageEmbed()
    .setTitle(symbol)
    .setColor(color)
    .setDescription(message);
  return embed;
}

var FinanceManager = function (bot) {
  this.stockInfo = function (message) {
    bot.user.setPresence({ activity: { name: "the stock market" , type: 0} });
    var symbol = querystring.escape(message.cleanContent.replace('!stock','')).toString().substr(3);

    var options = {
      method: 'GET',
      url: rapidAPIURL,
      qs: {symbol: symbol, function: 'GLOBAL_QUOTE'},
      headers: {
        'x-rapidapi-host': rapidAPIHost,
        'x-rapidapi-key': AuthDetails.financeKey,
        useQueryString: true
      }
    };

      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        message.reply(financeEmbedBuilder(symbol, body));
      });
  }
}

module.exports = FinanceManager;
