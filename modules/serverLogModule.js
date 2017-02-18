var winston = require('winston');

var ServerLogManager = function (bot){

  this.editedMessageEvent = function (originalMessage, updatedMessage) {
  var serverLogChannel = bot.channels.find("name", "serverlog");
  
  if ((originalMessage.embeds.length == updatedMessage.embeds.length) && !(originalMessage.pinned == updatedMessage.pinned)) {
      serverLogChannel.sendMessage('**Updated Message**\n' + originalMessage.author.username + '#' +
      originalMessage.author.discriminator + '' + ' updated their message in the ' +
      originalMessage.channel + ' channel\n**Original Message:** \n' +
      originalMessage.cleanContent + '\n**Updated Message:** \n' +
      updatedMessage.cleanContent + '\n')
      .catch((err) => winston.error("couldn't send edited message info:", err));
    }
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
    var serverLogChannel = bot.channels.find("name", "serverlog");

    serverLogChannel.sendMessage('**New Channel Created**\n' + 'A new channel named ' +
    newChannel + ' was created.\n')
    .catch((err) => winston.error("couldn't send new channel message info:", err));
  }

  this.channelUpdatedEvent = function (originalChannel, updatedChannel) {
    var serverLogChannel = bot.channels.find("name", "serverlog");

    serverLogChannel.sendMessage('**Updated Channel**\n' +
    'The ' + originalChannel.name + ' channel was updated.' +
    '\n**Original Channel:** \t' + originalChannel.name +
    '\n\tName: ' + originalChannel.name +
    '\n\tType: ' + originalChannel.type +
    '\n\tPosition: ' + originalChannel.position +
    '\n\tTopic: ' + originalChannel.topic +
    '\n**Updated Channel:** \t' + updatedChannel +
    '\n\tName: ' + updatedChannel.name +
    '\n\tType: ' + updatedChannel.type +
    '\n\tPosition: ' + updatedChannel.position +
    '\n\tTopic: ' + updatedChannel.topic + '\n')
    .catch((err) => winston.error("couldn't send new channel message info:", err));
  }

  this.channelDeletedEvent = function (deletedChannel) {
    var serverLogChannel = bot.channels.find("name", "serverlog");

    serverLogChannel.sendMessage('**Channel Deleted**\n' +
    'The ' + deletedChannel.name + ' channel was deleted.' +
    '\n**Original Channel:** \t' + deletedChannel.name +
    '\n\tName: ' + deletedChannel.name +
    '\n\tType: ' + deletedChannel.type +
    '\n\tPosition: ' + deletedChannel.position +
    '\n\tTopic: ' + deletedChannel.topic + '\n')
    .catch((err) => winston.error("couldn't send new channel message info:", err));
  }

  this.serverUpdatedEvent = function (originalServer, updatedServer) {
    var serverLogChannel = bot.channels.find("name", "serverlog");

    serverLogChannel.sendMessage('**Updated Server**\n' +
    'The ' + originalServer.name + ' channel was updated.' +
    '\n**Original Server:** \t' + originalServer.name +
    '\n\tName: ' + originalServer.name +
    '\n\tRegion: ' + originalServer.region +
    '\n\tOwner: ' + originalServer.owner.username + '#' + originalServer.owner.discriminator +
    '\n\tAFK Timeout: ' + originalServer.afkTimeout +
    '\n\tAFK Channel: ' + originalServer.afkChannel +
    '\n\tDefault Channel: ' + originalServer.defaultChannel +
    '\n\tCreation Date: ' + originalServer.createdAt +
    '\n**Updated Server:** \t' + updatedServer.name +
    '\n\tName: ' + updatedServer.name +
    '\n\tRegion: ' + updatedServer.region +
    '\n\tOwner: ' + updatedServer.owner.username + '#' + updatedServer.owner.discriminator +
    '\n\tAFK Timeout: ' + updatedServer.afkTimeout +
    '\n\tAFK Channel: ' + updatedServer.afkChannel +
    '\n\tDefault Channel: ' + updatedServer.defaultChannel +
    '\n\tCreation Date: ' + updatedServer.createdAt +'\n')
    .catch((err) => winston.error("couldn't send new channel message info:", err));
  }

  this.serverRoleCreatedEvent = function (newServerRole) {
    var serverLogChannel = bot.channels.find("name", "serverlog");

    serverLogChannel.sendMessage('**New Server Role Created**\n' +
    'A new server role named ' + newServerRole + ' was created.' +
    '\n\tName: ' + newServerRole.name +
    '\n\tID: ' + newServerRole.id +
    '\n\tColor: ' + newServerRole.hexColor +
    '\n\tCreation Date: ' + newServerRole.createdAt + '\n')
    .catch((err) => winston.error("couldn't send new channel message info:", err));
  }

  this.serverRoleDeletedEvent = function (deletedServerRole) {
    var serverLogChannel = bot.channels.find("name", "serverlog");

    serverLogChannel.sendMessage('**Server Role Deleted**\n' +
    'The ' + deletedServerRole.name + ' server role was deleted.' +
    '\n**Original Channel:** \t' + deletedServerRole.name +
    '\n\tName: ' + deletedServerRole.name +
    '\n\tID: ' + deletedServerRole.id +
    '\n\tColor: ' + deletedServerRole.hexColor +
    '\n\tCreation Date: ' + deletedServerRole.createdAt + '\n')
    .catch((err) => winston.error("couldn't send new channel message info:", err));
  }

  this.serverRoleUpdatedEvent = function (originalRole, updatedRole) {
    var serverLogChannel = bot.channels.find("name", "serverlog");

    serverLogChannel.sendMessage('**Updated Server Role**\n' +
    'The ' + originalRole.name + ' server role was updated.' +
    '\n**Original Role:** \t' + originalRole.name +
    '\n\tName: ' + deletedServerRole.name +
    '\n\tID: ' + deletedServerRole.id +
    '\n\tColor: ' + deletedServerRole.hexColor +
    '\n\tCreation Date: ' + deletedServerRole.createdAt +
    '\n**Updated Role:** \t' + updatedRole.name +
    '\n\tName: ' + updatedRole.name +
    '\n\tID: ' + updatedRole.id +
    '\n\tColor: ' + updatedRole.hexColor +
    '\n\tCreation Date: ' + updatedRole.createdAt + '\n')
    .catch((err) => winston.error("couldn't send new channel message info:", err));
  }

}

module.exports = ServerLogManager;
