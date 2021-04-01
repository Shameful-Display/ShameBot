const Discord = require('discord.js');
const https = require('https');

const FFXIVManager = function ffxivManager() {
  this.setCharacter = function setCharacter(message, dbCollection) {
    const contentIndex = message.content.indexOf(' ');
    const content = message.content.slice(contentIndex);
    const splitContent = content.split('|');

    const characterName = splitContent[0];
    const serverName = splitContent[1];

    const pathWithParameters = encodeURI(`/character/search?name=${characterName}&server=${serverName}`);

    const optionsget = {
      host: 'xivapi.com',
      port: 443,
      path: pathWithParameters,
      method: 'GET',
    };

    const reqGet = https.request(optionsget, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const jsonObj = JSON.parse(data);

        const character = jsonObj.Results[0];

        const embed = new Discord.MessageEmbed()
          .setColor('#24a2e2')
          .setAuthor(character.Name, 'https://jaehyuk-lee.github.io/FFXIV-KR-PF-Client-test/static/img/ffxiv-logo.b28c8b8.png')
          .setDescription(`Is this you, ${message.author.toString()}?\nClick on the ✅ reaction to register to your DiscordID.`)
          .setThumbnail(character.Avatar)
          .addField('Server', character.Server, true)
          .addField('Character ID', character.ID, true);

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
                    // Set FFXIV ID
                    const query = { id: message.author.id };
                    const update = { $set: { id: message.author.id, ffxivID: character.ID } };
                    const options = { upsert: true };

                    dbCollection.updateOne(query, update, options)
                      .then(() => {
                        message.channel.send('Your FFXIV ID has been associated with your DiscordID!');
                      })
                      .catch((err) => {
                        message.channel.send(`There was an error associating your FFXIV ID with your DiscordID: ${err}`);
                      });
                  }
                })
                .catch(() => {
                  console.log('Failed Reaction');
                }));
          });
      });
    });

    reqGet.end();
    reqGet.on('error', (e) => {
      console.error(e);
    });
  };

  this.clearCharacter = function clearCharacter(message, dbCollection) {
    const userID = message.author.id;

    // Clear Assigned FFXIV ID from UserID in Mongo
    dbCollection.deleteOne(
      { id: userID },
    );
    message.reply('Your FFXIV ID has been cleared!');
  };

  this.showCharacter = function showCharacter(message, dbCollection) {
    const userID = message.author.id;

    dbCollection.findOne({ id: userID }, { ffxivID: 1 }, (err, doc) => {
      if (err) throw err;

      if (doc == null) {
        message.reply('You haven\'t associated a FFXIV ID with your DiscordID.\rUse the command `!ffxiv-set [Name]|[Server]` to set this up. \n\nExample: \n ```!ffxiv-set Sephiroth|Cactuar```');
        return;
      }

      const { ffxivID } = doc;

      const pathWithParameters = `/character/${ffxivID}`;

      const optionsget = {
        host: 'xivapi.com',
        port: 443,
        path: pathWithParameters,
        method: 'GET',
      };

      const reqGet = https.request(optionsget, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          const jsonObj = JSON.parse(data);
          const character = jsonObj.Character;
          const activeClass = character.ActiveClassJob;
          const classJobs = character.ClassJobs;

          const embed = new Discord.MessageEmbed()
            .setColor('#24a2e2')
            .setAuthor(character.Name, 'https://jaehyuk-lee.github.io/FFXIV-KR-PF-Client-test/static/img/ffxiv-logo.b28c8b8.png')
            .setTitle(`${activeClass.UnlockedState.Name}/ Level ${activeClass.Level}`)
            .setThumbnail(character.Avatar)
            .setImage(character.Portrait);

          let raceName;
          switch (character.Race) {
            case 1:
              raceName = 'Hyur';
              break;
            case 2:
              raceName = 'Elezen';
              break;
            case 3:
              raceName = 'Lalafell';
              break;
            case 4:
              raceName = 'Miqo\'te';
              break;
            case 5:
              raceName = 'Roegadyn';
              break;
            case 6:
              raceName = 'Au Ra';
              break;
            case 7:
              raceName = 'Hrothgar';
              break;
            case 8:
              raceName = 'Viera';
              break;
            default:
              break;
          }
          embed.addField('Race', raceName);

          embed.addFields(
            { name: 'Nameday', value: character.Nameday },
            { name: 'Server', value: character.Server },
            { name: 'Class Jobs', value: '-------------------------------------------------------' },
          );

          classJobs.forEach((classJob) => {
            if (classJob.Level !== 0) {
              embed.addField(classJob.UnlockedState.Name, classJob.Level, true);
            }
          });

          const mod = classJobs.length % 3;
          for (let i = 0; i < 3 - mod; i += 1) {
            embed.addField('󠀠󠀠\u200b‎', '\u200b', true);
          }

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

module.exports = FFXIVManager;
