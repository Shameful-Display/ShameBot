var botVersion = "0.7";
var botStartTime = new Date();
var winston = require('winston');
const { Client, MessageEmbed } = require('discord.js');

var infoEmbedBuilder = function(title, message) {
  const embed = new MessageEmbed()
    .setTitle(title)
    .setColor(0x00B0FF)
    .setDescription(message);
  return embed;
}

var InfoManager = function (bot){
  this.help = function (message){
    var title = "Bot Commands"
    var details = ("\r__Available commands__ :\r" +
		"**!help** : List of possible commands.\r" +
    "**!about** : General info on the bot.\r" +
		"**!uptime** : Returns bot's uptime.\r" +
		"**!stats** : Returns general bot stats.\r" +
    "**!fullStats** : Returns expanded bot stats.\r" +
		"**!battle begin *@player1* *@player2* ** : Rock Paper Scissors with someone.\r" +
    "**!findSteamID *Steam User Name* ** : Associate your Steam acct with your Discord acct.\r" +
    "**!steamID** : See SteamID that is associated with your Discord acct.\r" +
    "**!steamTop10** : Returns your top 10 most played games on Steam.\r" +
    "**!clearSteamID** : Remove SteamID associated with your Discord acct.\r" +
    "***@user* ++** : Give someone an upvote (can be used anywhere in a sentence or standalone).\r" +
    "***@user* --** : Give someone a downvote (can be used anywhere in a sentence or standalone). \r" +
    "**!honor *@user*** : Get user's total honor/karma.\r" +
    "**!setPCBuild *PCPartPicker.com part list permalink*** : Associate your PC build with your Discord ID.\r" +
    "**!PCBuild *@user*** : Returns user's PC Build\r" +
    "**!gif *search-terms*** : Returns a gif matching your search terms \r" +
    "**!ffxiv-set [Name]|[Server]** : Searches for a character to associate to your DiscordID. Example \`!ffxiv-set Sephiroth|Cactuar\` \r" +
    "**!ffxiv-clear** : Clears the associated character from your DiscordID \r" +
    "**!ffxiv-show** : Shows your associated FFXIV character's profile and class jobs");

    message.reply(infoEmbedBuilder(title, details));
  }

  this.about = function (message){
    var title = "About the Bot";
    var details = ("ShameBot Version " + botVersion + "\r" +
		"Stack: Discord.js, Node.js, Ubuntu, Digital Ocean, GitHub, and pm2.\r" +
		"Find us on GitHub!\r" +
		"https://github.com/Shameful-Display/ShameBot\r" +
		"@B1anc0N1n0 @DaKing @TeckHybrid");
    message.reply(infoEmbedBuilder(title, details));
  }

  this.stats = function (message){
    var title = "Bot Stats"
    var details = ("Working hard for [" + bot.guilds.cache.size + "] Servers " +
    "in [" + bot.channels.cache.size + "] Channels for [" + bot.users.cache.size + "] Users!");
    message.reply(infoEmbedBuilder(title, details));
  }

  this.fullStats = function (message){
    var title = "Full Bot Stats";
    var serverNames = [];
    var channelNames = [];
    var userNames = [];

    bot.guilds.cache.forEach(function(guild) {
      serverNames.push (guild.name);
    });
    bot.channels.cache.forEach(function(channel) {
      channelNames.push (channel.name);
    });
    bot.users.cache.forEach(function(user) {
      userNames.push (user.username + "#" + user.discriminator);
    });
    var details = ("Here are your full stats as requested:\n\n" +
      "**Servers:**\n\`\`\`" + serverNames+ "\`\`\`" +
      "**Channels:**\n\`\`\`" + channelNames + "\`\`\`" +
      "**Users:**\n\`\`\`" + userNames + "\`\`\`");
    message.reply(infoEmbedBuilder(title, details));
  }

  this.uptime = function (message){
    var title = "Bot Uptime";
    var botUptime = Math.abs(new Date() - botStartTime);
		var x = botUptime / 1000;
		var uptimeSeconds = Math.floor(x % 60);
		x /= 60;
		var uptimeMinutes = Math.floor(x % 60);
		x /= 60;
		var uptimeHours = Math.floor(x % 24);
		x /= 24;
		var uptimeDays = Math.floor(x);
		botUptime = "D:H:M:S - " + uptimeDays + ":" + uptimeHours + ":" + uptimeMinutes + ":" + uptimeSeconds;
    message.reply(infoEmbedBuilder(title, botUptime));
  }
}

module.exports = InfoManager;
