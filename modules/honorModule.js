const HonorManager = function honorManager() {
  function returnHonor(message, user, serverID, honorCollection) {
    const myCursor = honorCollection.find(
      { id: user.id, server: serverID },
      { upvotes: 1, downvotes: 1 },
    );
    myCursor.each((err, doc) => {
      if (err) throw err;
      if (doc != null) {
        const { upvotes } = doc;
        const { downvotes } = doc;
        const netHonor = upvotes - downvotes;
        message.reply(`${user.username} has ${netHonor} honor!`);
      }
    });
  }

  this.initializeAndReturnHonor = function initializeAndReturnHonor(message, honorCollection) {
    const serverID = message.channel.guild.id;
    const user = message.mentions.users.array()[0];

    honorCollection.findOne({ id: user.id, server: serverID }, (err, doc) => {
      if (err) throw err;
      if (doc == null) {
        honorCollection.insertOne(
          {
            id: user.id, server: serverID, upvotes: 0, downvotes: 0,
          },
        );
      }
      returnHonor(message, user, serverID, honorCollection);
    });
  };

  this.updateHonor = function updateHonor(message, honorCollection) {
    const serverID = message.channel.guild.id;

    if (message.mentions.users) { // check if message has any mentions
      // store array of user objects which were mentioned in message
      const mentionsArray = message.mentions.users.array();
      const messageTokens = message.content.split(' '); // tokenize message into array
      for (let i = 0; i < messageTokens.length; i += 1) { // step through tokenized message array
        if (messageTokens[i].charAt(0) === '<') { // check if word is a mention by checking for the opening char
          let legitMention = false; // initialize flag for legitimate mentions
          const slicedStringMention = messageTokens[i].slice(2, -1).toString().replace(/[!]/g, ''); // extract user ID from mention in the message (removing <@ and >) && removes ! from userIDs with a nickname
          for (const userObj of mentionsArray) { // step through each object in the mentions array
            // check to see if the user ID found matches a real mention
            if (userObj.id === slicedStringMention && !userObj.equals(message.author)) {
              legitMention = true;
            }
          }
          if (legitMention === true) { // if the user id from the string is good
            if (messageTokens[i + 1] === '++') { // check to see if the token following the mention is a '++' for upvote
              honorCollection.updateOne(
                { id: slicedStringMention, server: serverID },
                { $inc: { upvotes: 1 } },
                { upsert: true },
              );
            } else if (messageTokens[i + 1] === '--' || messageTokens[i + 1] === '—') { // check to see if the token following the mention is a '--' for downvote
              honorCollection.updateOne(
                { id: slicedStringMention, server: serverID },
                { $inc: { downvotes: 1 } },
                { upsert: true },
              );
            }
          }
        }
      }
    }
  };
};

module.exports = HonorManager;
