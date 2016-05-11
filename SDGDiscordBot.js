//Note: the .js is not required as Node assumes these files are javascript
//node modules to include
var Discord = require("discord.js")
var winston = require('winston')
//initial bot setup
var bot = new Discord.Client({autoReconnect: true});
var AuthDetails = require("./auth.json");
//bot modules
var RPSManager = require("./modules/RPSManager.js")
var rpsManager = new RPSManager(bot);
var MemeManager = require("./modules/memeRepliesModule.js")
var MemeReplies = new MemeManager(bot);
var TableCatchManager = require("./modules/tableCatcherModule.js")
var CatchManager = new TableCatchManager(bot);
var InfoManager = require("./modules/informationModule.js")
var InfoReplies = new InfoManager(bot);

//---------------------------- WINSTON ----------------------------||
winston.add( //add transport (console is default)
	winston.transports.File, { //add File transport type
		filename: 'standardLog.log', //base filename
		level: 'info', //level at which to log messages
		json: true, //log in JSON format
		timestamp: true, //append timestamp to log if true
		dirname: './logs', //directory name
		maxsize: 10000000, //size in bytes where roll over will occur
		maxFiles: 0, //# of files to keep after roll over occurs
		tailable: true //keep roll over in ascending order so that most current file is always base file name
	}
)
//-------------------------WINSTON  ENDSTON------------------------||



bot.on("disconnected", function(){
	winston.info("** Shamebot disconnected at " + new Date() + " **");
});

bot.on("ready", function(){
	winston.info("|| -- Shamebot ready for input at " + new Date() + " -- ||");
});

bot.on("message", function(message)
{
	//don't listen for self messages
	if (message.author.id == bot.user.id){
		return;
	}
	//Make all message content lower case so all triggers can be written lower case and always work.
	var lowerCaseMessage = message.content.toLowerCase();

	//help
	if(message.content.includes("!help")){
		InfoReplies.help(message);
	}

	//about
	if(message.content.includes("!about")){
		InfoReplies.about(message);
	}

	//uptime
	if(message.content.includes("!uptime")){
		InfoReplies.uptime(message);
	}

	//John Cena
	if(lowerCaseMessage.includes("and his name is") ||
		lowerCaseMessage.includes("and his name was") ||
		message.content.includes("\uD83C\uDFBA")){
			MemeReplies.cenaReply(message);
	}

	//KoolAid
	if(lowerCaseMessage.includes("oh no") ||
		lowerCaseMessage.includes("hey koolaid")){
		MemeReplies.koolaidReply(message);
	}

	// Macho Man!
	if(lowerCaseMessage.includes("savage")) {
		MemeReplies.machoManReply(message);
	}

	// Tiny Rick!!!!
	if(lowerCaseMessage.includes("tiny rick")) {
		MemeReplies.tinyRickReply(message);
	}

  // Rock, Paper, Scissors
	if (message.content.substring(0, 7) == "!battle") {
	  rpsManager.parseCommand(message);
	}
	if (message.channel.isPrivate && rpsManager.isBattleOn()) {
	  rpsManager.parseCommand(message);
	}

	//Table Catcher
	if(message.content.includes("(╯°□°）╯︵ ┻━┻")){
		CatchManager.tableCatcherReply(message);
	}

});

bot.loginWithToken(AuthDetails.token);
