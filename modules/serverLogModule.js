var ServerLogManager = function (bot){

  this.editedMessageEvent = function (originalMessage, updatedMessage) {
    var serverLogChannel = bot.channels.find("name", "serverlog");

    serverLogChannel.sendMessage('**Updated Message**\n' + originalMessage.author.username + '#' +
    originalMessage.author.discriminator + '' + ' updated their message in the ' +
    originalMessage.channel + ' channel\n**Original Message:** \n' +
    originalMessage.cleanContent + '\n**Updated Message:** \n' +
    updatedMessage.cleanContent + '\n')
    .catch((err) => winston.error("couldn't send edited message info:", err));
  }

  this.deletedMessageEvent = function (deletedMessage, channel) {
    var serverLogChannel = bot.channels.find("name", "serverlog");

    serverLogChannel.sendMessage('**Deleted Message**\n' + deletedMessage.author.username + '#' +
    deletedMessage.author.discriminator + '' + ' deleted this message in the ' +
    deletedMessage.channel + ' channel\n**Deleted Message:** \n' +
    deletedMessage.cleanContent)
    .catch((err) => winston.error("couldn't send deleted message info:", err));
  }

  this.newChannelEvent = function (newChannel) {
    var serverLogChannel = bot.channels.get("name", "serverlog");

    bot.sendMessage(serverLogChannel, '**New Channel Created**\n' + 'A new channel named ' +
    newChannel + ' was created.\n');
  }

}

module.exports = ServerLogManager;
