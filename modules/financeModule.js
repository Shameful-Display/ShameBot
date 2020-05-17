var fs = require( "fs" );
var path = require( "path" );
var process = require( "process" );
var querystring = require('querystring');
var winston = require('winston');
var AuthDetails = require("../auth.json");
const { Client, MessageEmbed } = require('discord.js');
const axios = require("axios");

const greenColor = "0x33FF00"
const redColor = "0xCC0000"
const neutralColor = "0x99FFFF"

const rapidAPIURL = "https://alpha-vantage.p.rapidapi.com/query";
const rapidAPIHost = "alpha-vantage.p.rapidapi.com";

var financeEmbedBuilder = function (symbol, message, color) {
  const embed = new MessageEmbed()
    .setTitle(symbol)
    .setColor(color)
    .setDescription(message);
  return embed;
}

var FinanceManager = function (bot) {
  this.stockInfo = function (message) {
    bot.user.setPresence({ activity: { name: "the stock market" , type: 0} });
    var company = querystring.escape(message.cleanContent.replace('!stock','')).toString().substr(3);

    axios({
        "method": "GET",
        "url": rapidAPIURL,
        "headers":{
            "content-type":"application/octet-stream",
            "x-rapidapi-host":rapidAPIHost,
            "x-rapidapi-key":AuthDetails.financeKey,
            "useQueryString":true},
        "params":{
            "symbol":company,
            "function":"GLOBAL_QUOTE"}
        })
        .then((response)=>{
            var infoList = response.data;
            var symbol = infoList["Global Quote"]["01. symbol"];
            var price = infoList["Global Quote"]["05. price"];
            var change = parseFloat(infoList["Global Quote"]["10. change percent"]);
            var stockColor = neutralColor;
            if (change > 0){
              stockColor = greenColor;
            } else {
              stockColor = redColor;
            }
            message.reply(financeEmbedBuilder(symbol + " Stock Info", "**" + symbol + "** \n" + "$" + price + "\n" + change.toString() + "%" + "\n", stockColor));
        })
        .catch((error)=>{
          winston.error("Finance Error: ", error);
          message.reply("Couldn't find '" + company + "'...maybe you shouldn't be trading if you don't know the symbol.");
        })
  }
}

module.exports = FinanceManager;
