# SDG-Discord-Bot
A multipurpose bot for a private Discord server.

## Getting Started:

### Pre-Reqs:

1. Node JS installed (version 9 or higher)[Download & Instructions](https://nodejs.org/en/download/)
2. MongoDB (https://www.mongodb.com/download-center)
   1. For Windows: Go to Community Server tab and download the *Windows Server 2008 R2 64-bit* version.
   2. For Windows: After installing, it is required that you create a new folder in the C: root named "data" and a folder named "db" inside of that. Failure to do so will result in MongoDB failing to run.
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
├── discord.js@11.2.1
└── winston@2.2.0
└── mongodb@2.1.21
```
Note: you can ignore the warnings about missing peer modules as these are optional for discord JS. They are used for Voice Support.

#### Issues
If you are having issues check the install steps for Discord.js [here](https://discord.js.org/#/docs/main/stable/general/welcome)


### Post Install Steps
After the dependencies are installed you are nearly ready to run the Shamebot but currently there are two items that need to be handled:
1. Make sure you have a discord developer account.
2. Go to https://discordapp.com/developers/applications/me to add your bot to the server.
   1. Create a new bot.
   2. Click "Create a bot user" button.
   3. Click "Generate OAuth2 URL" button.
   4. Select bot permissions.
   5. Copy the generated URL into your browser address bar and go.
   6. Select a server to add the bot to.
2. Enter your bot token:
   1. Go back to your bot page on discord. Under "App bot user" you will see "Token: click to reveal". Click it. This is your bot's token.
   2. Create an auth.json file in the root of the repository - Terminal example:
   ```
   MacBook:SDG_Discord_Bot awesomeUser$ touch auth.json
   ```
   3. Enter the following information:
   ```
   {
     "token" : "your bot token",
     "steamAPIKey" : "your Steam API key"
     "giphyAPIKey : your giphy API key"
   }
     ```
These will be fixed at a later date but for now the above is needed to properly run the bot.

### Running the Bot
Before starting up the bot you will need to be running mongodb locally as the bot will look at mongodb://localhost:27017/shamebotdb
To start MongoDB go into the bin file and run mongod.exe.

Then simply run the bot and you should see it connect:
```

MacBook:SDG_Discord_Bot awesomeUser$ node SDGDiscordBot.js
info: || -- Shamebot ready for input at Thu May 12 2016 12:03:32 GMT-0400 (EDT) -- ||
```

## Bot Commands
ShameBot comes equipped with a help command to list possible commands:
```
@AwesomeUser, Available commands (all commands start with !) :
help
uptime
```
