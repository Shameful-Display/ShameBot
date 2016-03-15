var Discord = require("discord.js")
var fs = require( 'fs' );
var path = require( 'path' );
var process = require( "process" );


var bot = new Discord.Client ();

var cenaImageFolder = "C:/Users/Quinten/Desktop/SDG_Discord_Bot/cenaimages/";

var cenaImageArray = new Array();

cenaImageArray = fs.readdirSync(cenaImageFolder);

bot.on("message", function(message)
{
	//Make all message content lower case so all triggers can be written lower case and always work.
	var lowerCaseMessage = message.content.toLowerCase();
	//John Cena
	if(lowerCaseMessage.includes("and his name is") ||
		lowerCaseMessage.includes("and his name was") ||
		message.content.includes("\uD83C\uDFBA")){ //Unicode trumpet
		bot.reply(message, "JOHN CENA!!!");
		/*Eventually I want to be able to loop through a folder containing
		any number of images, have them put into an array, then send a random image from said array.
		Assigning one/many files one at a time is static which will lead to issues
		and is not convinient. The file names shouldn't be hardcoded...*/
		bot.sendFile(message.channel, "C:/Users/Quinten/Desktop/SDG_Discord_Bot/cenaimages/cena1.jpg","jonny.png", (err, message) => {
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
	
	//KoolAid - no larger goal on this one...just the KoolAid man. Ohhhh yeeahh!
	if(message.content.includes("oh no")){
		bot.reply(message, "OHHHHH YEEEAAAHHHHH!!!");
		bot.sendFile(message.channel, "C:/Users/Quinten/Desktop/SDG_Discord_Bot/koolaid.jpg","koolaid.jpg", (err, message) => {
			if(err)
				console.log("couldn't send image:", err);
		});
	}
});

bot.login("botEmail", "botPass", function (error, token){
	if (error) {
		console.log("couldn't logon:", error);
	}
});

//bot.loginWithToken(token,email,password,callback);


