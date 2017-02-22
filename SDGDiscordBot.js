//Note: the .js is not required as Node assumes these files are javascript
//node modules to include
const Discord = require("discord.js"),
    bot = new Discord.Client({
      autoReconnect:true
    })
var fs = require( "fs" );
var path = require( "path" );
var process = require( "process" );
var winston = require('winston');
var winstonModule = require("./modules/winstonModule.js");
var MongoClient = require('mongodb').MongoClient;
var db;
var honorCollection;
var steamIDCollection;
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
var ServerLogManager = require("./modules/serverLogModule.js")
var ServerLog = new ServerLogManager(bot);
var request = require("request"),
  cheerio = require("cheerio");


//global connection for MongoDB
MongoClient.connect("mongodb://localhost:27017/shamebotdb", function(err, database) {
	if(err) throw err;

	db = database;
	honorCollection = db.collection('honorCollection');
	steamIDCollection = db.collection('SteamIDtoDiscordID');
  PCBuildCollection = db.collection('PCBuilds');
});

//initialize file transport for winston
winstonModule.createWinstonFileTransport();

bot.on("disconnected", () => {
	winston.info("** Shamebot disconnected at " + new Date() + " **");
});

bot.on("ready", () => {
	winston.info("|| -- Shamebot ready for input at " + new Date() + " -- ||");
});

bot.on("message", message => {
	if (message.channel.type == 'dm' || message.channel.type == 'group') {
    return
  }
  var serverID = message.channel.guild.id;

	//don't listen for self messages
	if (message.author.id == bot.user.id || message.author.bot){
		return;
	}
	//Make all message content lower case so all triggers can be written lower case and always work.
	var lowerCaseMessage = message.content.toLowerCase();

	//------------------------- Honor System Start ------------------------||
	function returnHonor(user, serverID){
		var myCursor = honorCollection.find(
			{id : user.id, server : serverID},
			{upvotes: 1, downvotes: 1}
		);
		myCursor.each(function(err, doc){
			if(err) throw err;
			if (doc != null){
				var upvotes = doc.upvotes;
				var downvotes = doc.downvotes;
				var netHonor = upvotes - downvotes;
				message.reply(user + " has " + netHonor + " honor!");
			}
		});
	}

	function initializeAndReturnHonor(user, serverID, callback){
		honorCollection.findOne({id: user.id, server: serverID}, function(err, doc){
			if(err) throw err;
			if(doc == null){
				honorCollection.insert(
					{id: user.id, server: serverID,  upvotes: 0, downvotes: 0}
				);
			}
			callback(user, serverID);
		});
	}

	if(message.mentions.users) { //check if message has any mentions
		var mentionsArray = message.mentions.users.array(); //store array of user objects which were mentioned in message
		var messageTokens = message.content.split(" "); //tokenize message into array
		for (i = 0; i < messageTokens.length; i++){ //step through tokenized message array
			if (messageTokens[i].charAt(0) == '<'){ //check if word is a mention by checking for the opening char
        var legitMention = false; //initialize flag for legitimate mentions
				slicedStringMention = messageTokens[i].slice(2, -1); //extract user ID from mention in the message (removing <@ and >)
				for (var userObj of mentionsArray){ //step through each object in the mentions array
          if (userObj.id == slicedStringMention && !userObj.equals(message.author) ) {// check to see if the user ID found matches a real mention
						legitMention = true;
					}
				}
				if (legitMention == true){ //if the user id from the string is good
					if (messageTokens[i+1] == '++'){ //check to see if the token following the mention is a '++' for upvote
            honorCollection.update(
							{ id: slicedStringMention, server: serverID },
							{ $inc: { upvotes: 1} },
							{upsert: true}
						);
					}else if (messageTokens[i+1] == '--'){ //check to see if the token following the mention is a '--' for downvote
            honorCollection.update(
							{ id: slicedStringMention, server: serverID },
							{ $inc: { downvotes: 1} },
							{upsert: true}
						);
					}
				}
			}
		}
	}

	//Command to return user's honor
	if(message.content.includes("!honor") && message.mentions.users.array().length == 1){
		var mentionedUser = message.mentions.users.array()[0];
		initializeAndReturnHonor(mentionedUser, serverID, returnHonor);
	}

	//-------------------------- Honor System End -------------------------||

  // Steam Association

	// Set Steam ID
	if(message.content.includes("!setSteamID")) {
		var splitContent = message.content.split(" ");
		var userID = message.author.id;
		var steamID = splitContent[1];

		if(/^\d+$/.test(steamID)) {
			// Assign SteamID to UserID in Mongo
			steamIDCollection.update(
				{ id: userID },
				{ id: userID, steamID: steamID },
				{ upsert: true }
			);
			message.reply("Your SteamID has been associated with your DiscordID!");
		} else
      {
				message.reply("A Steam ID must be a string comprised only of numbers. \n\nExample: \n ```!setSteamID 76561197960434622```");
			}
	}

	// Clear Steam ID
	if(message.content.includes("!clearSteamID")) {
		var userID = message.author.id;

		// Clear Assigned Steam ID from UserID in Mongo
		db.collection('SteamIDtoDiscordID').deleteOne(
			{ id: userID }
		);
		message.reply("Your SteamID has been cleared!");
	}

	// Return Steam ID
	if(message.content.includes("!steamID")) {
		var userID = message.author.id;
		steamIDCollection.findOne({id: userID}, {steamID: 1}, function(err, doc) {
		  if (err) throw err;
			if (doc == null) {
				message.reply("You haven't associated a SteamID with your DiscordID. Use the command !setSteamID to set this up. \n\nExample: \n ```!setSteamID 76561197960434622```\nNeed help finding your SteamID? Try https://steamid.io/");
				return;
			}
			message.reply("SteamID: " + doc.steamID);
		});
	}

	// Get Top Ten Played Games
	if(message.content.includes("!steamTop10")) {
		var userID = message.author.id;

		steamIDCollection.findOne({id: userID}, {steamID: 1}, function(err, doc) {
			if (err) throw err;

			if (doc == null) {
				message.reply("You haven't associated a SteamID with your DiscordID. Use the command !setSteamID to set this up. \n\nExample: \n ```!setSteamID 76561197960434622``` \nNeed help finding your SteamID? Try https://steamid.io/");
				return;
			}

			var steamID = doc.steamID;

			var https = require('https');
			var pathWithParameters = "/IPlayerService/GetOwnedGames/v0001/?key=" + AuthDetails.steamAPIKey + "&steamid=" + steamID + "&format=json&include_appinfo=1";

			var optionsget = {
  			host : 'api.steampowered.com',
  			port : 443,
  			path : pathWithParameters,
  			method : 'GET' // do GET
			};

			var reqGet = https.request(optionsget, function(res) {
				var data = "";
  			res.on('data', function(chunk) {
					data += chunk;
  			});

				res.on("end", function() {

					var jsonObj = JSON.parse(data);
					var gameList = jsonObj.response.games;

					gameList.sort(function(a, b) {
		    		return b.playtime_forever - a.playtime_forever;
					});

					var responseString = "Your Top 10 Played Games: \n```"
					for (i = 0; i < Math.min(gameList.length, 10); i++) {
						var game = gameList[i];
						responseString += i+1 + ". " + game.name + " | " + parseFloat(game.playtime_forever/60).toFixed(2) + " hours played \n";
					}
					responseString += "```";

					message.reply(responseString);
				});
			});

			reqGet.end();
			reqGet.on('error', function(e) {
  			console.error(e);
			});
		});
	}

  if(message.content.includes("!setPCBuild")){
    var splitContent = message.content.split(" ");
    var userID = message.author.id;
    var userName = message.author.username;
		var partPickerURL = splitContent[1];
    var buildString = "";
    var components = [];
    var wattage = "";
    var updatedDate;

    function scrapeSite (url, userid, username, buildString, serverID, callback1, callback2) {
      request(url, function (error, response, html) {
        if (error) {
          console.log("We’ve encountered an error: " + error);
        } else {
  		     var $ = cheerio.load(html);
           wattage = $('#explain_wattage').text();
           $('.manual-zebra').find("tr").each(function(item){
             var x = [];

             if ($(this).find(".component-type.tl").find('a').length !== 0){
               x[0] = $(this).find(".component-type.tl").find('a').text();
             } else if ($(this).find(".component-type.tl").length !== 0 && $(this).find(".component-type.tl").text() !== ""){
               x[0] = $(this).find(".component-type.tl").text();
               x[0] = x[0].replace(/\n/g,""); //remove \n chars
               x[0] = x[0].trim(); //remove whitespace
             } else if ($(this).find(".component-type.tl").length !== 0){
               x[0] = components[item-1][0];
             } else {
               x[0] = "";
             }

             if ($(this).find(".component-name.tl").find('a').length !== 0){
               x[1] = $(this).find(".component-name.tl").find('a').text();
             }else {
               x[1] = "";
             }

            if (x[0] !== "" && x[1] == "") {
              x[1] = $(this).find("td:nth-child(3)").text();
            }

             components[item] = x;
           });

           callback1(components, userID, username, buildString, serverID, callback2);
  			 }
  		});
    }

    function componentsIntoString(components, userID, username, buildString, serverID, callback){
      for (var i = 0; i < components.length; i++){
        if (i == 0){
          updatedDate = new Date();
          updatedDate = updatedDate.toDateString();
          buildString += "\n__**" + username + "'s PC Build:**__\n\n**Power draw:** " + wattage + "\n**Build URL:** " + partPickerURL + "\n**Last updated on Discord:** "+ updatedDate + "\n\n";
        }
        if (components[i][0] !== '') {
          buildString += "**" + components[i][0] + "**: " + components[i][1] + "\n";
        }
      }
      callback(userID, buildString, serverID);
    }

    function saveBuildToDB(userID, buildString, serverID){
      PCBuildCollection.update(
				{ id: userID, server: serverID },
				{ id: userID, server: serverID, pcBuild: buildString },
				{ upsert: true }
			);
      message.reply("Your build has been accepted!");
    }

    if(/^(http)[s]?(:\/\/pcpartpicker.com\/list\/)\w*$/.test(partPickerURL)) {
      scrapeSite(partPickerURL, userID, userName, buildString, serverID, componentsIntoString, saveBuildToDB);
    } else {
      message.reply("You must enter `!setPCBuild` and then the build's URL from pcpartpicker.com. The build URL must be in the following format \n `!setPCBuild http://pcpartpicker.com/list/tMnjyf`");
      return;
    }
  }

  if(message.content.includes("!PCBuild") && message.mentions.length == 1){
    var mentionedUser = message.mentions[0];

    function returnPCBuild (user, serverID){
  		PCBuildCollection.findOne({id: mentionedUser.id, server: serverID}, function(err, doc){
  			if(err) throw err;
  			if(doc == null){
  				message.reply(mentionedUser.username + " has not set their PC Build yet." + mentionedUser.username + " must enter `!setPCBuild` and then the build's URL from pcpartpicker.com. The build URL must be in the following format \n `!setPCBuild http://pcpartpicker.com/list/tMnjyf`");
  			}else{
          var myCursor = PCBuildCollection.find(
      			{id : user.id, server : serverID},
      			{pcBuild: 1}
      		);

      		myCursor.each(function(err, doc){
      			if(err) throw err;
      			if (doc != null){
      				var build = doc.pcBuild;
      				message.reply(build);
      			}
      		});
        }
  		});
  	}
    returnPCBuild(mentionedUser, serverID);
  }

	//help
	if(message.content.includes("!help")){
		InfoReplies.help(message);
	}

	//about
	if(message.content.includes("!about")){
		InfoReplies.about(message);
	}

	//stats
	if(message.content.includes("!stats")){
		InfoReplies.stats(message);
	}

	//fullStats
	if(message.content.includes("!fullStats")){
		InfoReplies.fullStats(message);
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

  // Harambe
  if(lowerCaseMessage.includes("jesus")) {
    MemeReplies.harambeReply(message);
  }

  // Rock, Paper, Scissors
	if (message.content.substring(0, 7) == "!battle") {
    message.reply("Currently Unsupported")
	  // rpsManager.parseCommand(message); //Commenting out until DM's are handled
	}
	// if (message.channel.isPrivate && rpsManager.isBattleOn()) {
	//   rpsManager.parseCommand(message);
	// }

	//Table Catcher
	if(message.content.includes("(╯°□°）╯︵ ┻━┻")){
		CatchManager.tableCatcherReply(message);
	}

});

// Server Logging
bot.on("messageUpdate", (originalMessage, updatedMessage) => {
  ServerLog.editedMessageEvent(originalMessage, updatedMessage);
});

bot.on("messageDelete", (deletedMessage, channel) => {
  ServerLog.deletedMessageEvent(deletedMessage, channel);
});

bot.on("channelCreate", (newChannel) => {
  ServerLog.newChannelEvent(newChannel);
});

bot.on("channelUpdate", function(originalChannel, updatedChannel){
  ServerLog.channelUpdatedEvent(originalChannel, updatedChannel);
});

bot.on("channelDelete", function(deletedChannel){
  ServerLog.channelDeletedEvent(deletedChannel);
});

bot.on("guildUpdated", function(originalServer, updatedServer){
  ServerLog.serverUpdatedEvent(originalServer, updatedServer);
});

bot.on("roleCreate", function(newServerRole){
  ServerLog.serverRoleCreatedEvent(newServerRole);
});

bot.on("roleDelete", function(deletedServerRole){
  ServerLog.serverRoleDeletedEvent(deletedServerRole);
});

bot.on("roleUpdate", function(originalRole, updatedRole){
  ServerLog.serverRoleUpdatedEvent(originalRole, updatedRole);
});

bot.login(AuthDetails.token);
