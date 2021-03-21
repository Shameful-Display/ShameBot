const Discord = require('discord.js');
const winston = require('winston');

var FFXIVManager = function (bot) {
    this.setCharacter = function (message, dbCollection) {
        var contentIndex = message.content.indexOf(" ");
        var content = message.content.slice(contentIndex);
        var splitContent = content.split("|");

        var characterName = splitContent[0];
        var serverName = splitContent[1];

        var https = require('https');
        var pathWithParameters = encodeURI("/character/search?name=" + characterName + "&server=" + serverName);

        var optionsget = {
            host: 'xivapi.com',
            port: 443,
            path: pathWithParameters,
            method: 'GET'
        };

        var reqGet = https.request(optionsget, function (res) {
            var data = "";
            res.on('data', function (chunk) {
                data += chunk;
            });

            res.on("end", function () {

                var jsonObj = JSON.parse(data);

                var character = jsonObj.Results[0];

                const embed = new Discord.MessageEmbed()
                    .setColor('#81e0f7')
                    .setTitle(character.Name)
                    .setDescription("Is this you, " + message.author.toString() + "?\nClick on the ✅ reaction to register to your DiscordID.")
                    .setThumbnail(character.Avatar)
                    .addField('Server', character.Server, true)
                    .addField('Character ID', character.ID, true)

                const filter = (reaction, user) => {
                    return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
                };

                message.channel.send(embed)
                    .then(embedMessage => {
                        embedMessage.react("✅")
                            .then(() => embedMessage.react("❌"))
                            .catch(() => console.error('One of the emojis failed to react.'))
                            .then(() => embedMessage.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                                .then(collected => {
                                    const reaction = collected.first();

                                    if (reaction.emoji.name === '✅') {
                                        // Set FFXIV ID
                                        const query = { id: message.author.id };
                                        const update = { $set: { id: message.author.id, steamID: character.ID } };
                                        const options = { upsert: true };

                                        dbCollection.updateOne(query, update, options)
                                            .then((obj) => {
                                                message.channel.send("Your FFXIV ID has been associated with your DiscordID!");
                                            })
                                            .catch((err) => {
                                                message.channel.send("There was an error associating your FFXIV ID with your DiscordID: " + err);
                                            })
                                    }
                                })
                    .catch(collected => {
                        console.log("Failed Reaction");
                    }))
        });
    });
});

reqGet.end();
reqGet.on('error', function (e) {
    console.error(e);
});
    }

this.saveCharacter = function (characterID, discordID) {
    console.log("HERE IT IS: " + characterID + " -- " + discordID);
}
}

module.exports = FFXIVManager;