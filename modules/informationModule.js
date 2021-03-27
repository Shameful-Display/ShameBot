const botVersion = '0.7';
const botStartTime = new Date();
const winston = require('winston');
const { Client, MessageEmbed } = require('discord.js');

const infoEmbedBuilder = function (title, message) {
  const embed = new MessageEmbed()
    .setTitle(title)
    .setColor(0x00B0FF)
    .setDescription(message);
  return embed;
};

const InfoManager = function (bot) {
  this.help = function (message) {
    const title = 'Bot Commands';
    const details = (`
__Available commands__ :
**!help** : List of possible commands.
**!about** : General info on the bot.
**!uptime** : Returns bot's uptime.
**!stats** : Returns general bot stats.
**!fullStats** : Returns expanded bot stats.
**!battle begin *@player1* *@player2* ** : Rock Paper Scissors with someone.
**!findSteamID *Steam User Name* ** : Associate your Steam acct with your Discord acct.
**!steamID** : See SteamID that is associated with your Discord acct.
**!steamTop10** : Returns your top 10 most played games on Steam.
**!clearSteamID** : Remove SteamID associated with your Discord acct.
***@user* ++** : Give someone an upvote (can be used anywhere in a sentence or standalone).
***@user* --** : Give someone a downvote (can be used anywhere in a sentence or standalone). 
**!honor *@user*** : Get user's total honor/karma.
**!setPCBuild *PCPartPicker.com part list permalink*** : Associate your PC build with your Discord ID.
**!PCBuild *@user*** : Returns user's PC Build
**!gif *search-terms*** : Returns a gif matching your search terms 
**!ffxiv-set [Name]|[Server]** : Searches for a character to associate to your DiscordID. Example \`!ffxiv-set Sephiroth|Cactuar\` 
**!ffxiv-clear** : Clears the associated character from your DiscordID 
**!ffxiv-show** : Shows your associated FFXIV character's profile and class jobs 
**!cheers [:beer:, :wine_glass:, or :tumbler_glass:]** : When you have one, Shamebot will drink with you! 
**!drunk** : Checks Shamebot's BAC without pouring him another`);

    message.reply(infoEmbedBuilder(title, details));
  };

  this.about = function (message) {
    const title = 'About the Bot';
    const details = (`ShameBot Version ${botVersion}
Stack: Discord.js, Node.js, Ubuntu, Digital Ocean, GitHub, and pm2.
Find us on GitHub!
https://github.com/Shameful-Display/ShameBot
@B1anc0N1n0 @DaKing @TeckHybrid`);
    message.reply(infoEmbedBuilder(title, details));
  };

  this.stats = function (message) {
    const title = 'Bot Stats';
    const details = (`Working hard for [${bot.guilds.cache.size}] Servers `
    + `in [${bot.channels.cache.size}] Channels for [${bot.users.cache.size}] Users!`);
    message.reply(infoEmbedBuilder(title, details));
  };

  this.fullStats = function (message) {
    const title = 'Full Bot Stats';
    const serverNames = [];
    const channelNames = [];
    const userNames = [];

    bot.guilds.cache.forEach((guild) => {
      serverNames.push(guild.name);
    });
    bot.channels.cache.forEach((channel) => {
      channelNames.push(channel.name);
    });
    bot.users.cache.forEach((user) => {
      userNames.push(`${user.username}#${user.discriminator}`);
    });
    const details = (`${'Here are your full stats as requested:\n\n'
      + '**Servers:**\n\`\`\`'}${serverNames}\`\`\``
      + `**Channels:**\n\`\`\`${channelNames}\`\`\``
      + `**Users:**\n\`\`\`${userNames}\`\`\``);
    message.reply(infoEmbedBuilder(title, details));
  };

  this.uptime = function (message) {
    const title = 'Bot Uptime';
    let botUptime = Math.abs(new Date() - botStartTime);
    let x = botUptime / 1000;
    const uptimeSeconds = Math.floor(x % 60);
    x /= 60;
    const uptimeMinutes = Math.floor(x % 60);
    x /= 60;
    const uptimeHours = Math.floor(x % 24);
    x /= 24;
    const uptimeDays = Math.floor(x);
    botUptime = `D:H:M:S - ${uptimeDays}:${uptimeHours}:${uptimeMinutes}:${uptimeSeconds}`;
    message.reply(infoEmbedBuilder(title, botUptime));
  };
};

module.exports = InfoManager;
