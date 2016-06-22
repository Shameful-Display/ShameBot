//Note: the .js is not required as Node assumes these files are javascript
//node modules to include
var Discord = require("discord.js")
var winston = require('winston')
var MongoClient = require('mongodb').MongoClient;
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
	var serverID = message.channel.server.id;
	//don't listen for self messages
	if (message.author.id == bot.user.id || message.author.bot){
		return;
	}
	//Make all message content lower case so all triggers can be written lower case and always work.
	var lowerCaseMessage = message.content.toLowerCase();

	//------------------------- Honor System Start ------------------------||
	if(message.mentions.length > 0) { //check if message has any mentions
		var mentionsArray = message.mentions; //store array of user objects which were mentioned in message
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
						MongoClient.connect("mongodb://localhost:27017/shamebotdb", function(err, db) {//open connection to db
						  if(err) {return callback(err)};
							db.collection('honorCollection').update(
								{ id: slicedStringMention, server: serverID },
								{ $inc: { upvotes: 1} },
								{upsert: true}
							);
							db.close();
						});
					}else if (messageTokens[i+1] == '--'){ //check to see if the token following the mention is a '--' for downvote
						MongoClient.connect("mongodb://localhost:27017/shamebotdb", function(err, db) {//open connection to db
						  if(err) {return callback(err)};
							db.collection('honorCollection').update(
								{ id: slicedStringMention, server: serverID },
								{ $inc: { downvotes: 1} },
								{upsert: true}
							);
							db.close();
						});
					}
				}
			}
		}
	}

	//Command to return user's honor.
	if(message.content.includes("!honor") && message.mentions.length == 1){
		var mentionedUser = message.mentions[0];
		MongoClient.connect("mongodb://localhost:27017/shamebotdb", function(err, db) {
			var myCursor = db.collection('honorCollection').find(
				{id : mentionedUser.id, server : serverID},
				{upvotes: 1, downvotes: 1}
			);
			myCursor.each(function(err, doc){
				if(err) throw err;
				if (doc != null){
					var upvotes = doc.upvotes;
					var downvotes = doc.downvotes;
					var netHonor = upvotes - downvotes;
					bot.reply(message, mentionedUser.username + " has " + netHonor + " honor!");
					db.close();
				}else {
					db.close();
				}
			});
		});
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
			MongoClient.connect("mongodb://localhost:27017/shamebotdb", function(err, db) {//open connection to db
				if(err) {return callback(err)};
				db.collection('SteamIDtoDiscordID').update(
					{ id: userID },
					{ id: userID, steamID: steamID },
					{ upsert: true }
				);
				bot.reply(message, "Your SteamID has been associated with your DiscordID!");
				db.close();
			});

		} else
      {
				bot.reply(message, "A Steam ID must be a string comprised only of numbers. \n\nExample: \n ```!setSteamID 76561197960434622```");
			}
	}

	// Clear Steam ID
	if(message.content.includes("!clearSteamID")) {
		var userID = message.author.id;

		// Clear Assigned Steam ID from UserID in Mongo
		MongoClient.connect("mongodb://localhost:27017/shamebotdb", function(err, db) {//open connection to db
			if(err) {return callback(err)};
			db.collection('SteamIDtoDiscordID').deleteOne(
				{ id: userID }
			);
			bot.reply(message, "Your SteamID has been cleared!");
			db.close();
		});
	}

	// Return Steam ID
	if(message.content.includes("!steamID")) {
		var userID = message.author.id;

		MongoClient.connect("mongodb://localhost:27017/shamebotdb", function(err, db) {
			var steamIDCollection = db.collection('SteamIDtoDiscordID');

			steamIDCollection.findOne({id: userID}, {steamID: 1}, function(err, doc) {
			  if (err) throw err

				if (doc == null) {
					bot.reply(message, "You haven't associated a SteamID with your DiscordID. Use the command !setSteamID to set this up. \n\nExample: \n ```!setSteamID 76561197960434622```");
					return;
				}

				bot.reply(message, "SteamID: " + doc.steamID);

			  db.close()
			})

		});
	}

	// Get Top Ten Played Games
	if(message.content.includes("!steamTop10")) {
		var userID = message.author.id;

		MongoClient.connect("mongodb://localhost:27017/shamebotdb", function(err, db) {
			var steamIDCollection = db.collection('SteamIDtoDiscordID');

			steamIDCollection.findOne({id: userID}, {steamID: 1}, function(err, doc) {
				if (err) throw err

				if (doc == null) {
					bot.reply(message, "You haven't associated a SteamID with your DiscordID. Use the command !setSteamID to set this up. \n\nExample: \n ```!setSteamID 76561197960434622```");
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

						bot.reply(message, responseString);
					});
				});

				reqGet.end();
				reqGet.on('error', function(e) {
    			console.error(e);
				});

				db.close();
			});
		});
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
