//Battle Manager
var BattleManager = function (bot) {
    this.isBattleOn = false;
    this.playerOne = null;
    this.playerTwo = null;

    this.battleChannel = null;

    this.parseCommand = function (message) {
        if (message.channel.isPrivate && !message.author.equals(bot.user)) {
            // Direct Message Received
            console.log("Direct Message Recieved");

            //Check for Player 1
            if (message.author.equals(this.playerOne.user)) {
                console.log("Player 1 Entry is In");
                switch (message.content.toLowerCase()) {
                    case "rock":
                        this.playerOne.choice = "Rock";
                        break;
                    case "paper":
                        this.playerOne.choice = "Paper";
                        break;
                    case "scissors":
                        this.playerOne.choice = "Scissors";
                        break;
                    default:
                        bot.reply(message, "Choose one of the following: Rock, Paper, Scissors");
                        break;
                }
            }

            //Check for Player 2
            if (message.author.equals(this.playerTwo.user)) {
                console.log("Player 2 Entry is In");
                switch (message.content.toLowerCase()) {
                    case "rock":
                        this.playerTwo.choice = "Rock";
                        break;
                    case "paper":
                        this.playerTwo.choice = "Paper";
                        break;
                    case "scissors":
                        this.playerTwo.choice = "Scissors";
                        break;
                    default:
                        bot.reply(message, "Choose one of the following: Rock, Paper, Scissors");
                        break;
                }
            }

            // Both answered?
            if (this.playerOne.choice && this.playerTwo.choice) {
                console.log("Both Entries are in!");

                var winningPlayer = null;
                switch (this.playerOne.choice) {
                    case "Rock":
                        switch (this.playerTwo.choice) {
                            case "Rock":
                                break;
                            case "Paper":
                                winningPlayer = this.playerTwo;
                                break;
                            case "Scissors":
                                winningPlayer = this.playerOne;
                                break;
                        }
                        break;
                    case "Paper":
                        switch (this.playerTwo.choice) {
                            case "Rock":
                                winningPlayer = this.playerOne;
                                break;
                            case "Paper":
                                break;
                            case "Scissors":
                                winningPlayer = this.playerTwo;
                                break;
                        }
                        break;
                    case "Scissors":
                        switch (this.playerTwo.choice) {
                            case "Rock":
                                winningPlayer = this.playerTwo;
                                break;
                            case "Paper":
                                winningPlayer = this.playerOne;
                                break;
                            case "Scissors":
                                break;
                        }
                }

                var victoryString = null;
                if (winningPlayer) {
                    victoryString = winningPlayer.user.username.toUpperCase() + " WINS!";
                } else {
                    victoryString = "It's a DRAW!";
                }

                bot.sendMessage(this.battleChannel, "```\n" + this.playerOne.user.username + "\t\t\t" + this.playerTwo.user.username + "\n" + this.playerOne.choice + "\t\t\t" + this.playerTwo.choice + "\n\n" + victoryString + "```");
                this.isBattleOn = false;
                this.playerOne = null;
                this.playerTwo = null;
                winningPlayer = null;
            }

        } else {
            // Public Message Received
            console.log("Public Message Received");

            // Begin Command
            if (message.content.includes("begin")) {
                this.battleChannel = message.channel;

                var validStart = true;

                if (message.mentions.length != 2) {
                    bot.sendMessage(this.battleChannel, "**Error:** Not enough players");
                    validStart = false;
                } else {
                    this.playerOne = new Player(message.mentions[0]);
                    this.playerTwo = new Player(message.mentions[1]);

                    if (this.isBattleOn) {
                        bot.sendMessage(this.battleChannel, "**Error:** No more than one active battle at a time");
                        validStart = false;
                    } else if (this.playerOne.user.equals(bot.user) || this.playerTwo.user.equals(bot.user)) {
                        bot.sendMessage(this.battleChannel, "**Error:** The bot can't be one of the players (yet).");
                        validStart = false;
                    } else if (this.playerOne.user.equals(this.playerTwo.user)) {
                        bot.sendMessage(this.battleChannel, "**Error:** Both players must be unique");
                        validStart = false;
                    } else if (this.playerOne.user.status != "online" || this.playerTwo.user.status != "online") {
                        bot.sendMessage(this.battleChannel, "**Error:** One or more players is not online");
                        validStart = false;
                    }
                }

                if (validStart) {
                    bot.sendMessage(this.battleChannel, "**ROCK - PAPER - SCISSORS** \n\n" + "**" + this.playerOne.user.username + "** *-- VS --* **" + this.playerTwo.user.username + "** \n" + "Both opponents must DM the bot with their selection.");
                    this.isBattleOn = true;
                } else {
                    this.playerOne = null;
                    this.playerTwo = null;
                }

            }
        }
    }
};

function Player(user) {
    this.user = user;
    this.choice = null;
}

module.exports = BattleManager;