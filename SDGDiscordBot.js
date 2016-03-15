//Note: the .js is not required as Node assumes these files are javascript
var Discord = require("discord.js")

//These three required for the fs.readdirSync()
var fs = require( 'fs' );
var path = require( 'path' );
var process = require( "process" );


var bot = new Discord.Client ();
var AuthDetails = require("./auth.json");

var cenaImageFolder = "C:/Users/Quinten/Desktop/SDG_Discord_Bot/cenaimages/";

var cenaImageArray = new Array();

//Loops through a given folder and creates an array of file names
cenaImageArray = fs.readdirSync(cenaImageFolder);

bot.on("message", function(message)
{
	//Make all message content lower case so all triggers can be written lower case and always work.
	var lowerCaseMessage = message.content.toLowerCase();
	//John Cena
	if(lowerCaseMessage.includes("and his name is") ||
		lowerCaseMessage.includes("and his name was") ||
		message.content.includes("\uD83C\uDFBA")){ //Unicode trumpet
		
		//Get random image path from array
		var randomCenaImageFilePath = cenaImageArray[Math.floor(Math.random() * cenaImageArray.length)];
		//Reply message	
		bot.reply(message, "\uD83C\uDFBA\uD83C\uDFBA\uD83C\uDFBA\uD83C\uDFBAJOHN CENA!\uD83C\uDFBA\uD83C\uDFBA\uD83C\uDFBA\uD83C\uDFBA");
		//Reply with random cena image
		bot.sendFile(message.channel, cenaImageFolder + randomCenaImageFilePath,"jonny.png", (err, message) => {
			if(err)
				console.log("couldn't send image:", err);
		})
	}
	
	//Catch tables
	/*The goal on this one is to escalate the catch-table-emoji's expression
	as people keep throwing tables. Something like - if table was thrown and caught
	in the last X seconds - perform escalated catch. After Y seconds, reset counters*/
	if(message.content === "(╯°□°）╯︵ ┻━┻"){
		bot.reply(message, "┬─┬﻿ ノ( ゜-゜ノ)")
	}
	/*
	if(message.content === "(╯°□°）╯︵ ┻━┻"){
		bot.reply(message, "┬─┬ノ(ಠ益ಠノ)")
	}
	if(message.content === "(╯°□°）╯︵ ┻━┻"){
		bot.reply(message, "┬─┬ノ(ಥ益ಥノ)")
	}
	//Maybe you get kicked here...
	*/
	
	//KoolAid - just the KoolAid man. Ohhhh yeeahh!
	if(lowerCaseMessage.includes("oh no") ||
		lowerCaseMessage.includes("hey koolaid")){
		bot.sendFile(message.channel, "C:/Users/Quinten/Desktop/SDG_Discord_Bot/koolaid.jpg","koolaid.jpg", (err, message) => {
			if(err)
				console.log("couldn't send image:", err);
		});
	}
});

bot.login(AuthDetails.email, AuthDetails.password);
