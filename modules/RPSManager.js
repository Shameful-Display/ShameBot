const CHOICE = {
  ROCK: 'Rock',
  PAPER: 'Paper',
  SCISSORS: 'Scissors',
};

// Battle Manager
const BattleManager = function (bot) {
  let _isBattleOn = false;
  let _playerOne = null;
  let _playerTwo = null;
  let _players = null;

  let _battleChannel = null;

  function parseDirectMessage(message) {
    // If the message author is the bot itself, ignore it and return
    if (message.author == bot.user) {
      return;
    }

    // Assign the Choice to Appropriate Player
    const activePlayer = messageAuthorToPlayer(message.author);
    if (assignChoiceToPlayer(activePlayer, message.content.toLowerCase())) {
      message.reply('Entry Acknowledged!');
    } else {
      message.reply('Choose one of the following: Rock, Paper, Scissors');
    }

    // Both answered?
    if (_playerOne.choice && _playerTwo.choice) {
      let winningPlayer = determineWinner(_playerOne, _playerTwo);

      let victoryString = null;
      if (winningPlayer) {
        victoryString = `${winningPlayer.user.username.toUpperCase()} WINS!`;
      } else {
        victoryString = "It's a DRAW!";
      }

      bot.send(_battleChannel, `\`\`\`\n${_playerOne.user.username}\t\t\t${_playerTwo.user.username}\n${_playerOne.choice}\t\t\t${_playerTwo.choice}\n\n${victoryString}\`\`\``);
      _isBattleOn = false;
      _playerOne = null;
      _playerTwo = null;
      winningPlayer = null;
    }
  }

  function parsePublicMessage(message) {
    // Begin Command
    if (message.content.includes('begin')) {
      _battleChannel = message.channel;

      let validStart = true;

      if (message.mentions.length != 2) {
        bot.send(_battleChannel, '**Error:** Not enough players');
        validStart = false;
      } else {
        _playerOne = new Player(message.mentions[0]);
        _playerTwo = new Player(message.mentions[1]);

        _players = [_playerOne, _playerTwo];

        // If playerOne is a bot, assign a random choice
        if (_playerOne.user.equals(bot.user)) {
          _playerOne.choice = randomChoice();
        }

        // If playerTwo is a bot, assign a random choice
        if (_playerTwo.user.equals(bot.user)) {
          _playerTwo.choice = randomChoice();
        }

        // Verify it's a valid game to start
        if (_isBattleOn) {
          bot.send(_battleChannel, '**Error:** No more than one active battle at a time');
          validStart = false;
        } else if (_playerOne.user.equals(_playerTwo.user)) {
          bot.send(this.battleChannel, '**Error:** Both players must be unique');
          validStart = false;
        } else if (_playerOne.user.status != 'online' || _playerTwo.user.status != 'online') {
          bot.send(_battleChannel, '**Error:** One or more players is not online');
          validStart = false;
        }
      }

      if (validStart) {
        bot.send(_battleChannel, `${'**ROCK - PAPER - SCISSORS** \n\n' + '**'}${_playerOne.user.username}** *-- VS --* **${_playerTwo.user.username}** \n` + 'Both opponents must DM the bot with their selection.');
        _isBattleOn = true;

        // Prompt players for their answers (so long as they aren't a bot)
        if (!_playerOne.user.equals(bot.user)) {
          bot.send(_playerOne.user, 'Rock, Paper, or Scissors?');
        }
        if (!_playerTwo.user.equals(bot.user)) {
          bot.send(_playerTwo.user, 'Rock, Paper, or Scissors?');
        }
      } else {
        _playerOne = null;
        _playerTwo = null;
      }
    }
  }

  this.parseCommand = function (message) {
    if (message.channel.isPrivate
            && !message.author.equals(bot.user)
            && (message.author.equals(_playerOne.user) || message.author.equals(_playerTwo.user))) {
      parseDirectMessage(message);
    } else {
      parsePublicMessage(message);
    }
  };

  this.isBattleOn = function () {
    return _isBattleOn;
  };

  function randomChoice() {
    const randomInt = Math.floor(Math.random() * (2 - 0 + 1)) + 0;
    switch (randomInt) {
      case 0:
        return CHOICE.ROCK;
      case 1:
        return CHOICE.PAPER;
      case 2:
        return CHOICE.SCISSORS;
      default:
        return CHOICE.ROCK;
    }
  }

  function assignChoiceToPlayer(player, choice) {
    let isValidChoice = false;
    switch (choice) {
      case 'rock':
        player.choice = CHOICE.ROCK;
        isValidChoice = true;
        break;
      case 'paper':
        player.choice = CHOICE.PAPER;
        isValidChoice = true;
        break;
      case 'scissors':
        player.choice = CHOICE.SCISSORS;
        isValidChoice = true;
        break;
      default:
        isValidChoice = false;
        break;
    }

    return isValidChoice;
  }

  function determineWinner(playerA, playerB) {
    if ((playerA.choice === playerB.choice)) {
      return null;
    }

    if ((playerA.choice === CHOICE.ROCK && playerB.choice === CHOICE.SCISSORS)
            || (playerA.choice === CHOICE.PAPER && playerB.choice === CHOICE.ROCK)
            || (playerA.choice === CHOICE.SCISSORS && playerB.choice === CHOICE.PAPER)) {
      return playerA;
    }

    return playerB;
  }

  function messageAuthorToPlayer(author) {
    for (let i = 0; i < _players.length; i += 1) {
      const player = _players[i];
      if (author.equals(player.user)) {
        return player;
      }
    }

    return null;
  }

  function Player(user) {
    this.user = user;
    this.choice = null;
  }
};

module.exports = BattleManager;
