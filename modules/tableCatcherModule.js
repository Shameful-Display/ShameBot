// Table catcher object constructor
const tableCatcherArray = []; // Keeps all TableCatcher objects

function TableCatcher(channel) {
  this.currentState = 0;
  this.emotionalState = ['┬─┬ノ( ゜-゜ノ)', '┬─┬ノ(ಠ益ಠノ)', '┬─┬ノ(ಥ益ಥノ)', '(/ .□.)\\ ︵╰(゜Д゜)╯︵ /(.□. \\)'];
  this.lastFlipTimestamp = new Date();
  this.channel = channel;
  this.tableBroken = false;
}

const tableCatchManager = function tableCatcherManger() {
  this.tableCatcherReply = function tableCatcherReply(message) {
    let channelHasCatcher = false;
    if (tableCatcherArray.length > 0) { // Make sure there's at least 1 object in the array
      // loop through array to see if object already exists for channel
      for (let i = 0; i < tableCatcherArray.length; i += 1) {
        const currentCatcher = tableCatcherArray[i]; // set new var to current array object
        // if the we find an object already exists for the channel
        if (currentCatcher.channel.equals(message.channel)) {
          channelHasCatcher = true;// set flag to true that channel already has object
          // if table is broken and it's been less than 5 minutes
          if (currentCatcher.tableBroken === true
            && Math.abs(new Date() - currentCatcher.lastFlipTimestamp) < 300000) {
            message.reply("*TABLE SHATTERS*: Shamebot's sick of your shit. He'll be back to save the tables in a few minutes.");
            // if table is broken but it's been 5 minutes or more
          } else if (currentCatcher.tableBroken === true
            && Math.abs(new Date() - currentCatcher.lastFlipTimestamp) >= 300000) {
            currentCatcher.tableBroken = false;
            message.reply(currentCatcher.emotionalState[currentCatcher.currentState]);
            currentCatcher.lastFlipTimestamp = new Date();
            currentCatcher.currentState += 1;
          } else { // else -> table is not broken...
            if (Math.abs(new Date() - currentCatcher.lastFlipTimestamp) <= 30000) {
              message.reply(currentCatcher.emotionalState[currentCatcher.currentState]);
              currentCatcher.lastFlipTimestamp = new Date();
              if (currentCatcher.currentState <= currentCatcher.emotionalState.length - 2) {
                currentCatcher.currentState += 1;
              } else {
                currentCatcher.currentState = 0;
                currentCatcher.tableBroken = true;
              }
            } else if (Math.abs(new Date() - currentCatcher.lastFlipTimestamp) > 30000) {
              const timePast = Math.abs(new Date() - currentCatcher.lastFlipTimestamp);
              let numberOfIncrementsPast = (timePast / 30000) - 1; // 30 seconds is one increment

              if (numberOfIncrementsPast < 1) {
                // return previous table catch emotion
                currentCatcher.currentState -= 1;
                message.reply(currentCatcher.emotionalState[currentCatcher.currentState]);
                currentCatcher.lastFlipTimestamp = new Date();
              } else {
                // decrease emotional states equal to the number of increments to a minimum of 0
                numberOfIncrementsPast = Math.floor(numberOfIncrementsPast);
                if (currentCatcher.currentState - numberOfIncrementsPast <= 0) {
                  currentCatcher.currentState = 0;
                  message.reply(currentCatcher.emotionalState[0]);
                } else {
                  currentCatcher.currentState -= numberOfIncrementsPast;
                  message.reply(currentCatcher.emotionalState[currentCatcher.currentState]);
                }
              }

              if (currentCatcher.currentState <= currentCatcher.emotionalState.length - 2) {
                currentCatcher.currentState += 1;
              } else {
                message.reply(currentCatcher.emotionalState[currentCatcher.currentState]);
                currentCatcher.currentState = 0;
                currentCatcher.tableBroken = true;
              }
            }
          }
        }
      }

      if (channelHasCatcher === false) {
        tableCatcherArray.push(new TableCatcher(message.channel));
        const currentCatcher = tableCatcherArray[tableCatcherArray.length - 1];
        message.reply(currentCatcher.emotionalState[currentCatcher.currentState]);
        currentCatcher.lastFlipTimestamp = new Date();
        currentCatcher.currentState += 1;
      }
    } else {
      tableCatcherArray[0] = new TableCatcher(message.channel);
      const currentCatcher = tableCatcherArray[0];
      message.reply(currentCatcher.emotionalState[currentCatcher.currentState]);
      currentCatcher.lastFlipTimestamp = new Date();
      currentCatcher.currentState += 1;
    }
  };
};

module.exports = tableCatchManager;
