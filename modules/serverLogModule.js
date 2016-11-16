var ServerLogManager = function (bot){

  this.editedMessageEvent = function (originalMessage, updatedMessage) {
    bot.sendMessage(originalMessage.client.channels.get("name", "serverlog"), '**Updated Message**\n' + originalMessage.author.username + '#' +
    originalMessage.author.discriminator + '' + ' updated their message in the ' +
    originalMessage.channel + ' channel\n**Original Message:** \n' +
    originalMessage.cleanContent + '\n**Updated Message:** \n' +
    updatedMessage.cleanContent + '\n');
  }

  this.deletedMessageEvent = function (deletedMessage, channel) {
    bot.sendMessage(deletedMessage.client.channels.get("name", "serverlog"), '**Deleted Message**\n' + deletedMessage.author.username + '#' +
    deletedMessage.author.discriminator + '' + ' deleted this message in the ' +
    deletedMessage.channel + ' channel\n**Deleted Message:** \n' +
    deletedMessage.cleanContent);
  }

  this.newChannelEvent = function (newChannel) {
    bot.sendMessage(newChannel.client.channels.get("name", "serverlog"), '**New Channel Created**\n' + 'A new channel named ' +
    newChannel + ' was created.\n');
  }

}

module.exports = ServerLogManager;
