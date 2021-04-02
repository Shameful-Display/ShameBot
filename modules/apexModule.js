const axios = require('axios');
const Discord = require('discord.js');
const winston = require('winston');
const AuthDetails = require('../auth.json');

const ApexManager = function ApexManager() {
  this.findOriginID = function findOriginID(message, dbCollection) {
    const splitContent = message.content.split(' ');
    const originName = splitContent[1];
    const userID = message.author.id;

    axios({
      method: 'GET',
      url: 'https://api.mozambiquehe.re/origin',
      headers: {
        authorization: AuthDetails.apexLegendsAPIKey,
        useQueryString: true,
      },
      params: {
        player: originName,
      },
    })
      .then((response) => {
        const player = response.data;

        const embed = new Discord.MessageEmbed()
          .setColor('#e30613')
          .setAuthor('Apex Profile', 'https://seeklogo.com/images/A/apex-logo-C3478A4601-seeklogo.com.png')
          .setTitle(player.name)
          .setDescription(`Is this you, ${message.author.toString()}?\nClick on the ✅ reaction to register to your DiscordID.`)
          .setThumbnail(player.avatar);

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
                    const update = {
                      $set: {
                        id: userID,
                        originId: player.name,
                      },
                    };
                    const options = { upsert: true };

                    dbCollection.updateOne(query, update, options)
                      .then(() => {
                        message.reply('Your OriginID has been associated with your DiscordID!');
                      })
                      .catch((err) => {
                        message.reply(`There was an error associating your OriginID with your DiscordID: ${err}`);
                      });
                  }
                })
                .catch(() => {
                  console.log('Failed Reaction');
                }));
          })
          .catch((error) => {
            winston.error('Get Origin Player Error: ', error);
          });
      });
  };

  this.getApexStats = function getApexStats(message, dbCollection) {
    const userID = message.author.id;

    dbCollection.findOne({ id: userID }, { originId: 1 }, (err, doc) => {
      if (err) throw err;

      if (doc == null) {
        message.reply('You haven\'t associated a Origin ID with your DiscordID.');
        return;
      }

      const { originId } = doc;

      axios({
        method: 'GET',
        url: 'https://api.mozambiquehe.re/bridge',
        headers: {
          authorization: AuthDetails.apexLegendsAPIKey,
          useQueryString: true,
        },
        params: {
          player: originId,
          platform: 'PC',
          version: '5',
        },
      })
        .then((response) => {
          console.log(response);
          const { global } = response.data;
          const { legends } = response.data;
          const { total } = response.data;

          const embed = new Discord.MessageEmbed()
            .setColor('#e30613')
            .setAuthor('Apex Profile', 'https://seeklogo.com/images/A/apex-logo-C3478A4601-seeklogo.com.png')
            .setTitle(global.name)
            .setThumbnail(legends.selected.ImgAssets.icon)
            .setImage(legends.selected.ImgAssets.banner);

          const filledBlocks = global.toNextLevelPercent / 5;
          let progressString = '';
          for (let i = 1; i <= 20; i += 1) {
            if (i <= filledBlocks) {
              progressString += '█';
            } else {
              progressString += '░';
            }
          }
          progressString += `  | ${global.toNextLevelPercent}%`;

          embed.addField('Active Legend', legends.selected.LegendName, true);
          embed.addField('Level', global.level, true);
          embed.addField('To Next Level', progressString);
          embed.addField('Rank', `${global.rank.rankName} ${global.rank.rankDiv}`);

          for (const [, stat] of Object.entries(total)) {
            embed.addField(
              stat.name.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase()),
              stat.value, true,
            );
          }

          embed.setFooter(legends.selected.gameInfo.intro);

          message.channel.send(embed);
        });
    });
  };

  this.getMapRotation = function getMapRotation(message) {
    axios({
      method: 'GET',
      url: 'https://api.mozambiquehe.re/maprotation/',
      headers: {
        authorization: AuthDetails.apexLegendsAPIKey,
        useQueryString: true,
      },
    })
      .then((response) => {
        console.log(response);
        const { current } = response.data;
        const { next } = response.data;

        const embed = new Discord.MessageEmbed()
          .setColor('#e30613')
          .setAuthor('Apex Map Rotation', 'https://seeklogo.com/images/A/apex-logo-C3478A4601-seeklogo.com.png')
          .setTitle(`Current Map: ${current.map}`)
          .addField('Remaining', `${current.remainingMins} minutes`, true)
          .addField('Next', next.map, true);

        switch (current.map) {
          case 'Kings Canyon':
            embed.setThumbnail('https://static.wikia.nocookie.net/apexlegends_gamepedia_en/images/c/cf/Loadingscreen_Kings_Canyon_MU3.png/revision/latest/scale-to-width-down/800?cb=20210202220042');
            break;
          case 'Olympus':
            embed.setThumbnail('https://static.wikia.nocookie.net/apexlegends_gamepedia_en/images/5/57/Loadingscreen_Olympus.png/revision/latest/scale-to-width-down/800?cb=20201105143428');
            break;
          case "World's Edge":
            embed.setThumbnail('https://static.wikia.nocookie.net/apexlegends_gamepedia_en/images/f/fe/Loadingscreen_World%27s_Edge_MU2.png/revision/latest/scale-to-width-down/800?cb=20200819134346');
            break;
          default:
            break;
        }

        message.channel.send(embed);
      });
  };
};

module.exports = ApexManager;
