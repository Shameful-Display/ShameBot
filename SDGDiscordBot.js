// Note: the .js is not required as Node assumes these files are javascript
// node modules to include
const { Client, MessageEmbed } = require('discord.js');

const bot = new Client();

const winston = require('winston');
const { MongoClient } = require('mongodb');
const winstonModule = require('./modules/winstonModule.js');

let db;
let honorCollection;
let steamIDCollection;
let ffxivCollection;
let drinkingCollection;

const AuthDetails = require('./auth.json');
// bot modules
const MemeManager = require('./modules/memeRepliesModule.js');

const MemeReplies = new MemeManager(bot);

const TableCatchManager = require('./modules/tableCatcherModule.js');

const CatchManager = new TableCatchManager(bot);

const InfoManager = require('./modules/informationModule.js');

const InfoReplies = new InfoManager(bot);

const ServerLogManager = require('./modules/serverLogModule.js');

const ServerLog = new ServerLogManager(bot);

const FinanceManager = require('./modules/financeModule.js');

const FinanceInfo = new FinanceManager(bot);

const FFXIVManager = require('./modules/ffxivModule.js');

const FFXIVInfo = new FFXIVManager(bot);

const SteamManager = require('./modules/steamModule.js');

const steamManager = new SteamManager(bot);

const DrinkingManager = require('./modules/drinkingModule.js');

const drinkingManager = new DrinkingManager(bot);

const GiphyManager = require('./modules/giphyModule.js');

const giphyManager = new GiphyManager(bot);

// global connection for MongoDB
MongoClient.connect('mongodb://localhost:27017shamebotdb', { useUnifiedTopology: true }, (err, client) => {
  if (err) throw err;

  db = client.db('shamebotdb');
  honorCollection = db.collection('honorCollection');
  steamIDCollection = db.collection('SteamIDtoDiscordID');
  ffxivCollection = db.collection('FFXIV');
  drinkingCollection = db.collection('Drinking');
});

const HonorManager = require('./modules/honorModule.js');

const honorManager = new HonorManager();

// initialize file transport for winston
winstonModule.createWinstonFileTransport();

bot.on('disconnected', () => {
  ServerLog.botConnectionStatus('disconnected');
});

bot.on('ready', () => {
  ServerLog.botConnectionStatus('ready');
  bot.user.setPresence({ activity: { name: 'with Shame', type: 0 } });
});

bot.on('warn', (warning) => {
  winston.info(`+| Warning: ${warning} |+`);
});

bot.on('error', (error) => {
  winston.info(`*|| Error: ${error} ||*`);
});

bot.on('message', (message) => {
  if (message.channel.type === 'dm' || message.channel.type === 'group') {
    return;
  }

  // don't listen for self messages
  if (message.author.id === bot.user.id || message.author.bot) {
    return;
  }

  // Make all message content lower case so all triggers can be written lower case and always work.
  const lowerCaseMessage = message.content.toLowerCase();

  // ------------------------- Honor System Start ------------------------||
  // Command to return user's honor
  if (message.content.includes('!honor') && message.mentions.users.array().length === 1) {
    honorManager.initializeAndReturnHonor(message, honorCollection);
  }

  if (message.mentions.users) {
    honorManager.updateHonor(message, honorCollection);
  }

  // -------------------------- Honor System End -------------------------||

  // Stocks

  if (message.content.includes('!stock')) {
    FinanceInfo.stockInfo(message);
  }

  // End stocks

  // Steam

  if (message.content.includes('!findSteamID')) {
    steamManager.findSteamID(message, steamIDCollection);
  }

  if (message.content.includes('!setSteamID')) {
    steamManager.setSteamID(message, steamIDCollection);
  }

  if (message.content.includes('!clearSteamID')) {
    steamManager.clearSteamID(message, steamIDCollection);
  }

  if (message.content.includes('!steamID')) {
    steamManager.steamID(message, steamIDCollection);
  }

  if (message.content.includes('!steamTop10')) {
    steamManager.steamTopTen(message, steamIDCollection);
  }

  // End Steam

  // FFXIV

  if (message.content.includes('!ffxiv-set')) {
    FFXIVInfo.setCharacter(message, ffxivCollection);
  }

  if (message.content.includes('!ffxiv-clear')) {
    FFXIVInfo.clearCharacter(message, ffxivCollection);
  }

  if (message.content.includes('!ffxiv-show')) {
    FFXIVInfo.showCharacter(message, ffxivCollection);
  }

  // End FFXIV

  // Drinking
  if (message.content.includes('!cheers')) {
    drinkingManager.addDrinks(message, drinkingCollection);
  }

  if (message.content.includes('!drunk')) {
    drinkingManager.getStatus(message, drinkingCollection);
  }

  // End Drinking

  // help
  if (message.content.includes('!help')) {
    InfoReplies.help(message);
  }

  // about
  if (message.content.includes('!about')) {
    InfoReplies.about(message);
  }

  // stats
  if (message.content.includes('!stats')) {
    InfoReplies.stats(message);
  }

  // fullStats
  if (message.content.includes('!fullStats')) {
    InfoReplies.fullStats(message);
  }

  // uptime
  if (message.content.includes('!uptime')) {
    InfoReplies.uptime(message);
  }

  // John Cena
  if (lowerCaseMessage.includes('and his name is')
  || lowerCaseMessage.includes('and his name was')
  || message.content.includes('\uD83C\uDFBA')) {
    MemeReplies.cenaReply(message);
  }

  // KoolAid
  if (lowerCaseMessage.includes('oh no')
  || lowerCaseMessage.includes('hey koolaid')) {
    MemeReplies.koolaidReply(message);
  }

  // Macho Man!
  if (lowerCaseMessage.includes('savage')) {
    MemeReplies.machoManReply(message);
  }

  // Tiny Rick!!!!
  if (lowerCaseMessage.includes('tiny rick')) {
    MemeReplies.tinyRickReply(message);
  }

  // Table Catcher
  if (message.content.includes('(╯°□°）╯︵ ┻━┻')) {
    CatchManager.tableCatcherReply(message);
  }

  // Giphy Search
  if (message.content.includes('!gif')) {
    giphyManager.search(message);
  }
});

// Server Logging
bot.on('messageUpdate', (originalMessage, updatedMessage) => {
  ServerLog.editedMessageEvent(originalMessage, updatedMessage);
});

bot.on('messageDelete', (deletedMessage, channel) => {
  ServerLog.deletedMessageEvent(deletedMessage, channel);
});

bot.on('channelCreate', (newChannel) => {
  ServerLog.newChannelEvent(newChannel);
});

bot.on('channelUpdate', (originalChannel, updatedChannel) => {
  ServerLog.channelUpdatedEvent(originalChannel, updatedChannel);
});

bot.on('channelDelete', (deletedChannel) => {
  ServerLog.channelDeletedEvent(deletedChannel);
});

bot.on('guildUpdated', (originalServer, updatedServer) => {
  ServerLog.serverUpdatedEvent(originalServer, updatedServer);
});

bot.on('roleCreate', (newServerRole) => {
  ServerLog.serverRoleCreatedEvent(newServerRole);
});

bot.on('roleDelete', (deletedServerRole) => {
  ServerLog.serverRoleDeletedEvent(deletedServerRole);
});

bot.on('roleUpdate', (originalRole, updatedRole) => {
  ServerLog.serverRoleUpdatedEvent(originalRole, updatedRole);
});

bot.login(AuthDetails.token);
