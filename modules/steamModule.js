var AuthDetails = require("../auth.json");

var SteamManager = function (bot) {
    this.setSteamID = function (message, dbCollection) {
        var splitContent = message.content.split(" ");
        var userID = message.author.id;
        var steamID = splitContent[1];

        const query = { id: userID };
        const update = { $set: { id: userID, steamID: steamID } };
        const options = { upsert: true };

        if (/^\d+$/.test(steamID)) {
            // Assign SteamID to UserID in Mongo
            dbCollection.updateOne(query, update, options)
                .then((obj) => {
                    message.reply("Your SteamID has been associated with your DiscordID!");
                })
                .catch((err) => {
                    message.reply("There was an error associating your SteamID with your DiscordID: " + err);
                })
        } else {
            message.reply("A Steam ID must be a string comprised only of numbers. \n\nExample: \n ```!setSteamID 76561197960434622```");
        }
    }

    this.clearSteamID = function (message, dbCollection) {
        var userID = message.author.id;

        dbCollection.deleteOne(
            { id: userID }
        );

        message.reply("Your SteamID has been cleared!");
    }

    this.steamID = function (message, dbCollection) {
        var userID = message.author.id;
		dbCollection.findOne({ id: userID }, { steamID: 1 }, function (err, doc) {
			if (err) throw err;
			if (doc == null) {
				message.reply("You haven't associated a SteamID with your DiscordID. Use the command !setSteamID to set this up. \n\nExample: \n ```!setSteamID 76561197960434622```\nNeed help finding your SteamID? Try https://steamid.io/");
				return;
			}
			message.reply("SteamID: " + doc.steamID);
		});
    }

    this.steamTopTen = function (message, dbCollection) {
        var userID = message.author.id;

		dbCollection.findOne({ id: userID }, { steamID: 1 }, function (err, doc) {
			if (err) throw err;

			if (doc == null) {
				message.reply("You haven't associated a SteamID with your DiscordID. Use the command !setSteamID to set this up. \n\nExample: \n ```!setSteamID 76561197960434622``` \nNeed help finding your SteamID? Try https://steamid.io/");
				return;
			}

			var steamID = doc.steamID;

			var https = require('https');
			var pathWithParameters = "/IPlayerService/GetOwnedGames/v0001/?key=" + AuthDetails.steamAPIKey + "&steamid=" + steamID + "&format=json&include_appinfo=1";

			var optionsget = {
				host: 'api.steampowered.com',
				port: 443,
				path: pathWithParameters,
				method: 'GET' // do GET
			};

			var reqGet = https.request(optionsget, function (res) {
				var data = "";
				res.on('data', function (chunk) {
					data += chunk;
				});

				res.on("end", function () {

					var jsonObj = JSON.parse(data);
					var gameList = jsonObj.response.games;

					gameList.sort(function (a, b) {
						return b.playtime_forever - a.playtime_forever;
					});

					var responseString = "Your Top 10 Played Games: \n```"
					for (i = 0; i < Math.min(gameList.length, 10); i++) {
						var game = gameList[i];
						responseString += i + 1 + ". " + game.name + " | " + parseFloat(game.playtime_forever / 60).toFixed(2) + " hours played \n";
					}
					responseString += "```";

					message.reply(responseString);
				});
			});

			reqGet.end();
			reqGet.on('error', function (e) {
				console.error(e);
			});
		});
    }
}

module.exports = SteamManager;