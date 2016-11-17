var ServerLogManager = function (bot){

  this.editedMessageEvent = function (originalMessage, updatedMessage) {
    // Make sure it's not a slash command adding embeded content to the message
    // Same for pinning counting as a message edit
    if ((originalMessage.embeds.length == updatedMessage.embeds.length) && (originalMessage.pinned == updatedMessage.pinned)) {
      bot.sendMessage(originalMessage.client.channels.get("name", "serverlog"), '**Updated Message**\n' + originalMessage.author.username + '#' +
      originalMessage.author.discriminator + '' + ' updated their message in the ' +
      originalMessage.channel + ' channel\n**Original Message:** \n' +
      originalMessage.cleanContent + '\n**Updated Message:** \n' +
      updatedMessage.cleanContent + '\n');
    }
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

  this.channelUpdatedEvent = function (originalChannel, updatedChannel) {
    bot.sendMessage(originalChannel.client.channels.get("name", "serverlog"), '**Updated Channel**\n' +
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
    '\n\tTopic: ' + updatedChannel.topic + '\n');
  }

  this.channelDeletedEvent = function (deletedChannel) {
    bot.sendMessage(deletedChannel.client.channels.get("name", "serverlog"), '**Channel Deleted**\n' +
    'The ' + deletedChannel.name + ' channel was deleted.' +
    '\n**Original Channel:** \t' + deletedChannel.name +
    '\n\tName: ' + deletedChannel.name +
    '\n\tType: ' + deletedChannel.type +
    '\n\tPosition: ' + deletedChannel.position +
    '\n\tTopic: ' + deletedChannel.topic + '\n');
  }

  this.serverUpdatedEvent = function (originalServer, updatedServer) {
    bot.sendMessage(originalServer.client.channels.get("name", "serverlog"), '**Updated Server**\n' +
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
    '\n\tCreation Date: ' + updatedServer.createdAt +'\n');
  }

  this.serverRoleCreatedEvent = function (newServerRole) {
    bot.sendMessage(newServerRole.client.channels.get("name", "serverlog"), '**New Server Role Created**\n' +
    'A new server role named ' + newServerRole + ' was created.' +
    '\n\tName: ' + newServerRole.name +
    '\n\tID: ' + newServerRole.id +
    '\n\tColor: ' + newServerRole.colorAsHex() +
    '\n\tCreation Date: ' + newServerRole.createdAt + '\n');
  }

  this.serverRoleDeletedEvent = function (deletedServerRole) {
    bot.sendMessage(deletedServerRole.client.channels.get("name", "serverlog"), '**Server Role Deleted**\n' +
    'The ' + deletedServerRole.name + ' server role was deleted.' +
    '\n**Original Channel:** \t' + deletedServerRole.name +
    '\n\tName: ' + deletedServerRole.name +
    '\n\tID: ' + deletedServerRole.id +
    '\n\tColor: ' + deletedServerRole.colorAsHex() +
    '\n\tCreation Date: ' + deletedServerRole.createdAt + '\n');
  }

  this.serverRoleUpdatedEvent = function (originalRole, updatedRole) {
    bot.sendMessage(originalRole.client.channels.get("name", "serverlog"), '**Updated Server Role**\n' +
    'The ' + originalRole.name + ' server role was updated.' +
    '\n**Original Role:** \t' + originalRole.name +
    '\n\tName: ' + deletedServerRole.name +
    '\n\tID: ' + deletedServerRole.id +
    '\n\tColor: ' + deletedServerRole.colorAsHex() +
    '\n\tCreation Date: ' + deletedServerRole.createdAt +
    '\n**Updated Role:** \t' + updatedRole.name +
    '\n\tName: ' + updatedRole.name +
    '\n\tID: ' + updatedRole.id +
    '\n\tColor: ' + updatedRole.colorAsHex() +
    '\n\tCreation Date: ' + updatedRole.createdAt + '\n');
  }

}

module.exports = ServerLogManager;
