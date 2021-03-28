const axios = require('axios');
const Discord = require('discord.js');
const winston = require('winston');
const https = require('https');
const AuthDetails = require('../auth.json');

const SteamManager = function SteamManager() {
  this.findSteamID = function findSteamID(message, dbCollection) {
    const splitContent = message.content.split(' ');
    const steamName = splitContent[1];
    const userID = message.author.id;

    axios({
      method: 'GET',
      url: 'https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/',
      headers: {
        useQueryString: true,
      },
      params: {
        key: AuthDetails.steamAPIKey,
        vanityurl: steamName,
      },
    })
      .then((response) => {
        const steamID = response.data.response.steamid;
        console.log(`STEAM ID: ${response.data.response}`);
        axios({
          method: 'GET',
          url: 'https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/',
          headers: {
            useQueryString: true,
          },
          params: {
            key: AuthDetails.steamAPIKey,
            steamids: steamID,
          },
        })
          .then((response) => {
            console.log(response);
            const player = response.data.response.players[0];

            const embed = new Discord.MessageEmbed()
              .setColor('#ff8200')
              .setAuthor('Steam Profile', 'https://logodix.com/logo/813259.png')
              .setURL(player.profileurl)
              .setTitle(player.personaname)
              .setDescription(`Is this you, ${message.author.toString()}?\nClick on the ✅ reaction to register to your DiscordID.`)
              .setThumbnail(player.avatarmedium)
              .addField('Steam ID', player.steamid);

            const filter = (reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;

            message.channel.send(embed)
              .then((embedMessage) => {
                embedMessage.react('✅')
                  .then(() => embedMessage.react('❌'))
                  .catch(() => console.error('One of the emojis failed to react.'))
                  .then(() => embedMessage.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                    .then((collected) => {
                      const reaction = collected.first();

                      if (reaction.emoji.name === '✅') {
                        const query = { id: userID };
                        const update = { $set: { id: userID, steamID: player.steamid } };
                        const options = { upsert: true };

                        dbCollection.updateOne(query, update, options)
                          .then(() => {
                            message.reply('Your SteamID has been associated with your DiscordID!');
                          })
                          .catch((err) => {
                            message.reply(`There was an error associating your SteamID with your DiscordID: ${err}`);
                          });
                      }
                    })
                    .catch(() => {
                      console.log('Failed Reaction');
                    }));
              });
          })
          .catch((error) => {
            winston.error('Get Steam Player Error: ', error);
          });
      })
      .catch((error) => {
        winston.error('Get Steam ID Error: ', error);
      });
  };

  this.clearSteamID = function clearSteamID(message, dbCollection) {
    const userID = message.author.id;

    dbCollection.deleteOne(
      { id: userID },
    );

    message.reply('Your SteamID has been cleared!');
  };

  this.steamID = function steamID(message, dbCollection) {
    const userID = message.author.id;
    dbCollection.findOne({ id: userID }, { steamID: 1 }, (err, doc) => {
      if (err) throw err;
      if (doc == null) {
        message.reply("You haven't associated a SteamID with your DiscordID. Use the command !setSteamID to set this up. \n\nExample: \n ```!setSteamID 76561197960434622```\nNeed help finding your SteamID? Try https://steamid.io/");
        return;
      }
      message.reply(`SteamID: ${doc.steamID}`);
    });
  };

  this.steamTopTen = function steamTopTen(message, dbCollection) {
    const userID = message.author.id;

    dbCollection.findOne({ id: userID }, { steamID: 1 }, (err, doc) => {
      if (err) throw err;

      if (doc == null) {
        message.reply("You haven't associated a SteamID with your DiscordID. Use the command !findSteamID to set this up. \n\nExample: \n ```!findSteamID UserName```");
        return;
      }

      const { steamID } = doc;

      const pathWithParameters = `/IPlayerService/GetOwnedGames/v0001/?key=${AuthDetails.steamAPIKey}&steamid=${steamID}&format=json&include_appinfo=1`;

      const optionsget = {
        host: 'api.steampowered.com',
        port: 443,
        path: pathWithParameters,
        method: 'GET', // do GET
      };

      const reqGet = https.request(optionsget, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          const jsonObj = JSON.parse(data);
          const gameList = jsonObj.response.games;

          gameList.sort((a, b) => b.playtime_forever - a.playtime_forever);

          const embed = new Discord.MessageEmbed()
            .setColor('#ff8200')
            .setAuthor(`${message.author.username}\'s Top 10 Games`, 'https://logodix.com/logo/813259.png');

          for (let i = 0; i < Math.min(gameList.length, 10); i += 1) {
            const game = gameList[i];
            embed.addField(`${i + 1}. ${game.name}`, `${parseFloat(game.playtime_forever / 60).toFixed(2)} hours played`);

            if (i === 0) {
              embed.setThumbnail(`http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_logo_url}.jpg`);
            }
          }

          embed.setFooter(`Total Number of Games: ${jsonObj.response.game_count}`);

          message.channel.send(embed);
        });
      });

      reqGet.end();
      reqGet.on('error', (e) => {
        console.error(e);
      });
    });
  };
};

module.exports = SteamManager;
