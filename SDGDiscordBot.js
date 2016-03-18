//Note: the .js is not required as Node assumes these files are javascript
var Discord = require( "discord.js" )

//These three required for the fs.readdirSync()
var fs = require( "fs" );
var path = require( "path" );
var process = require( "process" );


var bot = new Discord.Client ();
var AuthDetails = require("./auth.json");

var cenaImageFolder = "./cenaimages/";

var cenaImageArray = new Array();
cenaImageArray = fs.readdirSync(cenaImageFolder);//Loops through a given folder and creates an array of file names

var tableCatchTimeStamps = new Array(3);
//Shitty code. Not sure if I need to initialize the array with date objects so I did it anyway.
for (var i = 0; i < tableCatchTimeStamps.length; i++){
	tableCatchTimeStamps[i] = new Date();
}

bot.on("message", function(message)
{
	function tableFlipInstance(channel, timeStamp){
		this.channelFlippedIn = channel;
		this.timeStamp = new Array(3);
		this.timeStamp[0] = timeStamp 
	}
	
	var tableFlipInstanceArray = new Array();
	
	//Make all message content lower case so all triggers can be written lower case and always work.
	var lowerCaseMessage = message.content.toLowerCase();
	//John Cena
	if(lowerCaseMessage.includes("and his name is") ||
		lowerCaseMessage.includes("and his name was") ||
		message.content.includes("\uD83C\uDFBA") &&
		!message.author.equals(bot.user)){ //Unicode trumpet
		
		//Reply message	
		bot.reply(message, "\uD83C\uDFBA\uD83C\uDFBA\uD83C\uDFBA\uD83C\uDFBA**JOHN CENA!**\uD83C\uDFBA\uD83C\uDFBA\uD83C\uDFBA\uD83C\uDFBA");
		console.log(message.author.username);
		//Get random image path from array
		var randomCenaImageFilePath = cenaImageArray[Math.floor(Math.random() * cenaImageArray.length)];
		//Reply with random cena image
		bot.sendFile(message.channel, cenaImageFolder.concat(randomCenaImageFilePath),"jonny.png", (err, message) => {
			if(err)
				console.log("couldn't send image:", err);
		})
	}
	
		
	//Catch tables
	//Todo: cooldown timer, channel specific, and fourth action
	if(message.content.includes("(╯°□°）╯︵ ┻━┻")){
		var tableFlipInstanceExists = false;
		for(var i = 0, i <= tableFlipInstanceArray.length, i++){
			var tableInstance = tableFlipInstance[i];
			if (tableInstance.channelFlippedIn.equals(message.channel)){
				tableFlipInstanceExists = true;
			}
		}
		if (tableFlipInstanceExists == false){
			tableFlipInstanceArray.push(new tableFlipInstanceArray(message.channel, message.timestamp));
		}
		if (Math.abs(new Date() - tableCatchTimeStamps[2]) <= 90000){
			tableCatchTimeStamps.unshift(new Date());
			tableCatchTimeStamps.splice(3, 1);
			bot.reply(message, "FOURTH CATCH - **add an action here**");
		} else if (Math.abs(new Date() - tableCatchTimeStamps[1]) <= 60000){
			tableCatchTimeStamps.unshift(new Date());
			tableCatchTimeStamps.splice(3, 1);
			bot.reply(message, "┬─┬ノ(ಥ益ಥノ)");
		} else if(Math.abs(new Date() - tableCatchTimeStamps[0]) <= 30000) {
			tableCatchTimeStamps.unshift(new Date());
			tableCatchTimeStamps.splice(3, 1);
			bot.reply(message, "┬─┬ノ(ಠ益ಠノ)");
		} else {
			tableCatchTimeStamps.unshift(new Date());
			tableCatchTimeStamps.splice(3, 1);
			bot.reply(message, "┬─┬﻿ ノ( ゜-゜ノ)");
		}
	}
	
	//KoolAid - just the KoolAid man. Ohhhh yeeahh!
	if(lowerCaseMessage.includes("oh no") ||
		lowerCaseMessage.includes("hey koolaid")){
		bot.sendFile(message.channel, "./koolaid.jpg","koolaid.jpg", (err, message) => {
			if(err)
				console.log("couldn't send image:", err);
		});
	}

	// Macho Man!
	if(lowerCaseMessage.includes("savage")) {
		bot.reply(message, "Ohhhh yeah brother!");
		bot.sendFile(message.channel, "./savage.jpg","savage.jpg", (err, message) => {
			if(err)
				console.log("couldn't send image:", err);
		});
	}
});

bot.login(AuthDetails.email, AuthDetails.password);
