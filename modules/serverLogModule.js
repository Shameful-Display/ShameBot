const winston = require('winston');

const ServerLogManager = function ServerLogManager(bot) {
  this.editedMessageEvent = function editedMessageEvent(originalMessage, updatedMessage) {
    const serverLogChannel = bot.channels.cache.find((ch) => ch.name === 'serverlog');

    if ((originalMessage.embeds.length === updatedMessage.embeds.length)
    && !(originalMessage.pinned === updatedMessage.pinned)) {
      serverLogChannel.send(`**Updated Message**\n${originalMessage.author.username}#${
        originalMessage.author.discriminator} updated their message in the ${
        originalMessage.channel} channel\n**Original Message:** \n${
        originalMessage.cleanContent}\n**Updated Message:** \n${
        updatedMessage.cleanContent}\n`)
        .catch((err) => winston.error("couldn't send edited message info:", err));
    }
  };

  this.deletedMessageEvent = function deletedMessageEvent(deletedMessage) {
    const serverLogChannel = bot.channels.cache.find((ch) => ch.name === 'serverlog');

    serverLogChannel.send(`**Deleted Message**\n${deletedMessage.author.username}#${
      deletedMessage.author.discriminator} deleted this message in the ${
      deletedMessage.channel} channel\n**Deleted Message:** \n${
      deletedMessage.cleanContent}`)
      .catch((err) => winston.error("couldn't send deleted message info:", err));
  };

  this.newChannelEvent = function newChannelEvent(newChannel) {
    const serverLogChannel = bot.channels.cache.find((ch) => ch.name === 'serverlog');

    serverLogChannel.send(`**New Channel Created**\nA new channel named ${
      newChannel} was created.\n`)
      .catch((err) => winston.error("couldn't send new channel message info:", err));
  };

  this.channelUpdatedEvent = function channelUpdatedEvent(originalChannel, updatedChannel) {
    const serverLogChannel = bot.channels.cache.find((ch) => ch.name === 'serverlog');

    serverLogChannel.send(`**Updated Channel**\nThe ${originalChannel.name} channel was updated.`
    + `\n**Original Channel:** \t${originalChannel.name}
\tName: ${originalChannel.name}
\tType: ${originalChannel.type}
\tPosition: ${originalChannel.position}
\tTopic: ${originalChannel.topic}
**Updated Channel:** \t${updatedChannel}
\tName: ${updatedChannel.name}
\tType: ${updatedChannel.type}
\tPosition: ${updatedChannel.position}
\tTopic: ${updatedChannel.topic}\n`)
      .catch((err) => winston.error("couldn't send new channel message info:", err));
  };

  this.channelDeletedEvent = function channelDeletedEvent(deletedChannel) {
    const serverLogChannel = bot.channels.cache.find((ch) => ch.name === 'serverlog');

    serverLogChannel.send(`**Channel Deleted**\nThe ${deletedChannel.name} channel was deleted.`
    + `\n**Original Channel:** \t${deletedChannel.name}
\tName: ${deletedChannel.name}
\tType: ${deletedChannel.type}
\tPosition: ${deletedChannel.position}
\tTopic: ${deletedChannel.topic}\n`)
      .catch((err) => winston.error("couldn't send new channel message info:", err));
  };

  this.serverUpdatedEvent = function serverUpdatedEvent(originalServer, updatedServer) {
    const serverLogChannel = bot.channels.cache.find((ch) => ch.name === 'serverlog');

    serverLogChannel.send(`**Updated Server**\nThe ${originalServer.name} channel was updated.`
    + `\n**Original Server:** \t${originalServer.name}
\tName: ${originalServer.name}
\tRegion: ${originalServer.region}
\tOwner: ${originalServer.owner.username}#${originalServer.owner.discriminator}
\tAFK Timeout: ${originalServer.afkTimeout}
\tAFK Channel: ${originalServer.afkChannel}
\tDefault Channel: ${originalServer.defaultChannel}
\tCreation Date: ${originalServer.createdAt}
**Updated Server:** \t${updatedServer.name}
\tName: ${updatedServer.name}
\tRegion: ${updatedServer.region}
\tOwner: ${updatedServer.owner.username}#${updatedServer.owner.discriminator}
\tAFK Timeout: ${updatedServer.afkTimeout}
\tAFK Channel: ${updatedServer.afkChannel}
\tDefault Channel: ${updatedServer.defaultChannel}
\tCreation Date: ${updatedServer.createdAt}\n`)
      .catch((err) => winston.error("couldn't send new channel message info:", err));
  };

  this.serverRoleCreatedEvent = function serverRoleCreatedEvent(newServerRole) {
    const serverLogChannel = bot.channels.cache.find((ch) => ch.name === 'serverlog');

    serverLogChannel.send(`**New Server Role Created**\nA new server role named ${newServerRole} was created.`
    + `\n\tName: ${newServerRole.name}
\tID: ${newServerRole.id}
\tColor: ${newServerRole.hexColor}
\tCreation Date: ${newServerRole.createdAt}\n`)
      .catch((err) => winston.error("couldn't send new channel message info:", err));
  };

  this.serverRoleDeletedEvent = function serverRoleDeletedEvent(deletedServerRole) {
    const serverLogChannel = bot.channels.cache.find((ch) => ch.name === 'serverlog');

    serverLogChannel.send(`**Server Role Deleted**\nThe ${deletedServerRole.name} server role was deleted.`
    + `\n**Original Channel:** \t${deletedServerRole.name}
\tName: ${deletedServerRole.name}
\tID: ${deletedServerRole.id}
\tColor: ${deletedServerRole.hexColor}
\tCreation Date: ${deletedServerRole.createdAt}\n`)
      .catch((err) => winston.error("couldn't send new channel message info:", err));
  };

  this.serverRoleUpdatedEvent = function serverRoleUpdatedEvent(originalRole, updatedRole) {
    const serverLogChannel = bot.channels.cache.find((ch) => ch.name === 'serverlog');

    serverLogChannel.send(`**Updated Server Role**\nThe ${originalRole.name} server role was updated.`
    + `\n**Original Role:** \t${originalRole.name}
\tName: ${originalRole.name}
\tID: ${originalRole.id}
\tColor: ${originalRole.hexColor}
\tCreation Date: ${originalRole.createdAt}
**Updated Role:** \t${updatedRole.name}
\tName: ${updatedRole.name}
\tID: ${updatedRole.id}
\tColor: ${updatedRole.hexColor}
\tCreation Date: ${updatedRole.createdAt}\n`)
      .catch((err) => winston.error("couldn't send new channel message info:", err));
  };

  this.botConnectionStatus = function botConnectionStatus(statusMessage) {
    const serverLogChannel = bot.channels.cache.find((ch) => ch.name === 'serverlog');

    const message = `** Shamebot ${statusMessage} at ${new Date()} **`;
    winston.info(message);

    serverLogChannel.send(message)
      .catch((err) => winston.error("couldn't send new channel message info:", err));
  };
};

module.exports = ServerLogManager;
