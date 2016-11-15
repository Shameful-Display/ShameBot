var ServerLogManager = function (bot){

  this.editedMessageEvent = function (originalMessage, updatedMessage) {
    var serverLogChannel = bot.channels.get("name", "serverlog");

    bot.sendMessage(serverLogChannel, '**Updated Message**\n' + originalMessage.author.username + '#' +
    originalMessage.author.discriminator + '' + ' updated their message in the ' +
    originalMessage.channel + ' channel\n**Original Message:** \n' +
    originalMessage.cleanContent + '\n**Updated Message:** \n' +
    updatedMessage.cleanContent + '\n');
  }

}

module.exports = ServerLogManager;
