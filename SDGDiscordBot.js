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

/*var tableCatchTimeStamps = new Array(3);
//Shitty code. Not sure if I need to initialize the array with date objects so I did it anyway.
for (var i = 0; i < tableCatchTimeStamps.length; i++){
	tableCatchTimeStamps[i] = new Date();
}*/

bot.on("message", function(message)
{
	function tableFlipInstance(channel, timeStamp){
		this.channelFlippedIn = channel;
		this.timeStamp = new Array(3);
		for (var i = 0; i < this.timeStamp.length; i++){
			this.timeStamp[i] = Math.abs(new Date() - 1200000);
		}
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
		console.log(message.timestamp);
		var tableFlipInstanceExists = false;
		var tableFlipIndex = 0;
		var tableFlipToCheck = tableFlipInstanceArray[tableFlipIndex];
		if (tableFlipInstanceArray.length == 0){
			var poop = new tableFlipInstance(message.channel, message.timestamp);
			tableFlipInstanceArray.push(poop);
			tableFlipIndex = tableFlipInstanceArray.length - 1;
			tableFlipInstanceExists = true;
		} else{
			for(var i = 0; i <= tableFlipInstanceArray.length; i++){
				var tableInstance = tableFlipInstanceArray[i];
				if (tableInstance.channelFlippedIn.equals(message.channel)){
					tableFlipInstanceExists = true;
					tableFlipIndex = i;
					tableFlipInstanceArray[i].timestamp.unshift(message.timestamp)
				}
			}	
		}
		if (tableFlipInstanceExists == false){
			var poop = new tableFlipInstance(message.channel, message.timestamp);
			tableFlipInstanceArray.push(poop);
			tableFlipIndex = tableFlipInstanceArray.length - 1;
		}
		var tableFlipToCheck = tableFlipInstanceArray[tableFlipIndex];
		if (Math.abs(new Date() - tableFlipToCheck.timeStamp[3]) <= 90000){
			tableFlipToCheck.timeStamp.unshift(new Date());
			tableFlipToCheck.timeStamp.splice(3, 1);
			bot.reply(message, "FOURTH CATCH - **add an action here**");
		} else if (Math.abs(new Date() - tableFlipToCheck.timeStamp[2]) <= 60000){
			tableFlipToCheck.timeStamp.unshift(new Date());
			tableFlipToCheck.timeStamp.splice(3, 1);
			bot.reply(message, "┬─┬ノ(ಥ益ಥノ)");
		} else if(Math.abs(new Date() - tableFlipToCheck.timeStamp[1]) <= 30000) {
			tableFlipToCheck.timeStamp.unshift(new Date());
			tableFlipToCheck.timeStamp.splice(3, 1);
			bot.reply(message, "┬─┬ノ(ಠ益ಠノ)");
		} else {
			tableFlipToCheck.timeStamp.unshift(new Date());
			tableFlipToCheck.timeStamp.splice(3, 1);
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
