# SDG-Discord-Bot
A multipurpose bot for a private Discord server.

## Getting Started:

### Pre-Reqs:

1. Node JS installed (version 4.0 or higher)[Download & Instructions](https://nodejs.org/en/download/)
2. MongoDB (https://www.mongodb.com/download-center)
3. Steam API Key (http://steamcommunity.com/dev/apikey)
3. Text Editor
4. John Cena

### Dependencies

From the root of the cloned repository run "npm install" which will use the include package.json file to get all of your dependencies installed.

Discord.js is a node js library for interacting with Discord's API.
Winston is a popular logging module.

Example:
```
MacBook:SDG_Discord_Bot awesomeUser$ npm install
shame_bot@0.5.0 /Users/awesomeUser/SDG_Discord_Bot
├── discord.js@7.0.1
└── winston@2.2.0
```

#### Issues
If you are having issues check the install steps for Discord.js [here](http://discordjs.readthedocs.org/en/latest/installing.html)


### Post Install Steps
After the dependencies are installed you are nearly ready to run the Shamebot but currently there are two items that need to be handled:

1. Enter your bot token (assuming you followed Discord steps to get an app and bot user generated):
```
MacBook:SDG_Discord_Bot awesomeUser$ touch auth.json
```
Enter the following information:
```
{
  "token" : "your bot token",
  "steamAPIKey" : "your Steam API key"
}
```
These will be fixed at a later date but for now the above is needed to properly run the bot.

### Running the Bot
Simply run the bot and you should see it connect:
```

MacBook:SDG_Discord_Bot awesomeUser$ node SDGDiscordBot.js
info: || -- Shamebot ready for input at Thu May 12 2016 12:03:32 GMT-0400 (EDT) -- ||
```

### Adding the bot to your server
To add the bot to your server use the follow URL (add in your client id) and any server that you have permissions to add a bot to will be listed.

https://discordapp.com/oauth2/authorize?&client_id=YourClientID&scope=bot&permissions=52224

## Bot Commands
ShameBot comes equipped with a help command to list possible commands:
```
@AwesomeUser, Available commands (all commands start with !) :
help
uptime
```
