var botVersion = "0.5";
var botStartTime = new Date();
var winston = require('winston');

var InfoManager = function (bot){
  this.help = function (message){
    message.reply("\r__Available commands__ :\r" +
		"**!help** : List of possible commands.\r" +
    "**!about** : General info on the bot.\r" +
		"**!uptime** : Returns bot's uptime.\r" +
		"**!stats** : Returns general bot stats.\r" +
    "**!fullStats** : Returns expanded bot stats.\r" +
		"**!battle begin *@player1* *@player2* ** : Rock Paper Scissors with someone.\r" +
    "**!setSteamID *Steam ID number* ** : Associate your Steam acct with your Discord acct.\r" +
    "**!steamID** : See SteamID that is associated with your Discord acct.\r" +
    "**!steamTop10** : Returns your top 10 most played games on Steam.\r" +
    "**!clearSteamID** : Remove SteamID associated with your Discord acct.\r" +
    "***@user* ++** : Give someone an upvote (can be used anywhere in a sentence or standalone).\r" +
    "***@user* --** : Give someone a downvote (can be used anywhere in a sentence or standalone). \r" +
    "**!honor *@user*** : Get user's total honor/karma.\r" +
    "**!setPCBuild *PCPartPicker.com part list permalink*** : Associate your PC build with your Discord ID.\r" +
    "**!PCBuild *@user*** : Returns user's PC Build");
  }

  this.about = function (message){
    message.reply("ShameBot Version " + botVersion + "\r" +
		"Stack: Discord.js, Node.js, Ubuntu, Digital Ocean, GitHub, and pm2.\r" +
		"Find us on GitHub!\r" +
		"https://github.com/B1anc0N1n0/SDG_Discord_Bot\r" +
		"@B1anc0N1n0 @DaKing @TeckHybrid");
  }

  this.stats = function (message){
    message.reply("Working hard for [" + bot.guilds.size + "] Servers " +
    "in [" + bot.channels.size + "] Channels for [" + bot.users.size + "] Users!");
  }

  this.fullStats = function (message){
    var serverNames = [];
    var channelNames = [];
    var userNames = [];

    message.reply("I've sent you a private message containing your request results.");

    bot.guilds.forEach(function(guild) {
      serverNames.push (guild.name);
    });
    bot.channels.forEach(function(channel) {
      channelNames.push (channel.name);
    });
    bot.users.forEach(function(user) {
      userNames.push (user.username + "#" + user.discriminator);
    });
    message.reply("Here are your full stats as requested:\n\n" +
      "**Servers:**\n\`\`\`" + serverNames+ "\`\`\`" +
      "**Channels:**\n\`\`\`" + channelNames + "\`\`\`" +
      "**Users:**\n\`\`\`" + userNames + "\`\`\`");
  }

  this.uptime = function (message){
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
    message.reply(botUptime);
  }
}

module.exports = InfoManager;
