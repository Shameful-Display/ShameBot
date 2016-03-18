//Note: the .js is not required as Node assumes these files are javascript
var Discord = require("discord.js")

//These three required for the fs.readdirSync()
var fs = require( 'fs' );
var path = require( 'path' );
var process = require( "process" );

var bot = new Discord.Client();
var battleManager = new BattleManager();
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
	
	/*Future feature: The John Cena Summer Slam PPV Event.
	new key word + @someone pulls cena and @someone into a new
	channel where they'll play a mini text game and fight john cena for
	the heavy weight title belt. @someone is given a list of options to choose from
	but unfortunately they're fighting champ and will lose regardless. Outcome is
	always the same because you can't C me now. trollface.jpg
	*/
	
	//Catch tables
	if(message.content.includes("(╯°□°）╯︵ ┻━┻")){
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

	if (message.content.substring(0, 7) == "!battle") {
	    battleManager.parseCommand(message);
	}
	if (message.channel.isPrivate && battleManager.isBattleOn) {
	    battleManager.parseCommand(message);
	}
});

bot.login(AuthDetails.email, AuthDetails.password);

//Battle Manager
function BattleManager() {
    this.isBattleOn = false;
    this.playerOne = null;
    this.playerTwo = null;

    this.battleChannel = null;

    this.parseCommand = function (message) {
        if (message.channel.isPrivate) {
            // Direct Message Received
            console.log("Direct Message Recieved");

            //Check for Player 1
            if (message.author.equals(this.playerOne.user)) {
                console.log("Player 1 Entry is In");
                switch(message.content.toLowerCase()){
                    case "rock":
                        this.playerOne.choice = "Rock";
                        break;
                    case "paper":
                        this.playerOne.choice = "Paper";
                        break;
                    case "scissors":
                        this.playerOne.choice = "Scissors";
                        break;
                }               
            }

            //Check for Player 2
            if (message.author.equals(this.playerTwo.user)) {
                console.log("Player 2 Entry is In");
                switch (message.content.toLowerCase()) {
                    case "rock":
                        this.playerTwo.choice = "Rock";
                        break;
                    case "paper":
                        this.playerTwo.choice = "Paper";
                        break;
                    case "scissors":
                        this.playerTwo.choice = "Scissors";
                        break;
                }
            }

            // Both answered?
            if (this.playerOne.choice && this.playerTwo.choice) {
                bot.sendMessage(this.battleChannel)
                console.log("Both Entries are in!");

                var winningPlayer = null;
                switch (this.playerOne.choice) {
                    case "Rock":
                        switch (this.playerTwo.choice) {
                            case "Rock":
                                break;
                            case "Paper":
                                winningPlayer = this.playerTwo;
                                break;
                            case "Scissors":
                                winningPlayer = this.playerOne;
                                break;
                        }
                        break;
                    case "Paper":
                        switch (this.playerTwo.choice) {
                            case "Rock":
                                winningPlayer = this.playerOne;
                                break;
                            case "Paper":
                                break;
                            case "Scissors":
                                winningPlayer = this.playerTwo;
                                break;
                        }
                        break;
                    case "Scissors":
                        switch (this.playerTwo.choice) {
                            case "Rock":
                                winningPlayer = this.playerTwo;
                                break;
                            case "Paper":
                                winningPlayer = this.playerOne;
                                break;
                            case "Scissors":
                                break;
                        }
                }

                var victoryString = null;
                if (winningPlayer) {
                    victoryString = winningPlayer.user.username.toUpperCase() + " WINS!";
                } else {
                    victoryString = "It's a DRAW!";
                }

                bot.sendMessage(this.battleChannel, "```\n" + this.playerOne.user.username + "\t\t\t" + this.playerTwo.user.username + "\n" + this.playerOne.choice + "\t\t\t" + this.playerTwo.choice + "\n\n" + victoryString + "```");
                this.isBattleOn = false;
                this.playerOne = null;
                this.playerTwo = null;
                winningPlayer = null;
            }

        } else {
            // Public Message Received
            console.log("Public Message Received");

            // Begin Command
            if (message.content.includes("begin")) {
                if (message.mentions.length == 2) {
                    this.playerOne = new Player(message.mentions[0]);
                    this.playerTwo = new Player(message.mentions[1]);
                    this.battleChannel = message.channel;

                    bot.sendMessage(this.battleChannel, "**ROCK - PAPER - SCISSORS** \n\n" + "**" + this.playerOne.user.username + "** *-- VS --* **" + this.playerTwo.user.username + "** \n" + "Both opponents must DM the bot with their selection.");

                    this.isBattleOn = true;
                } else {
                    bot.sendMessage(this.battleChannel, "Not Enough Players");
                }
               
            }
        }
    }
}

function Player(user) {
    this.user = user;
    this.choice = null;
}
