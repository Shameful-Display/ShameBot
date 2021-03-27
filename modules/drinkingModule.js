const Discord = require('discord.js');

function minutesToHourMinuteString(n) {
    var num = n;
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return rhours + "h " + rminutes + "m ";
}

var DrinkingManager = function (bot) {
    this.addDrinks = function (message, dbCollection) {
        var beerCount = 0;
        var wineCount = 0;
        var liquorCount = 0;

        beerCount = (message.content.match(/🍺/g) || []).length;
        wineCount = (message.content.match(/🍷/g) || []).length;
        liquorCount = (message.content.match(/🥃/g) || []).length;

        if (beerCount == 0 && wineCount == 0 && liquorCount == 0) { 
            message.reply("I'm only drinking a 🍺, 🍷, or 🥃");
            return;
         }

        const doc = {
            createdAt: new Date(),
            beer: beerCount,
            wine: wineCount,
            liquor: liquorCount
        };

        dbCollection.insertOne(doc)
            .then((obj) => {
                this.getStatus(message, dbCollection);
            })
            .catch((err) => {
                message.channel.send("Party Foul: " + err);
            })
    }

    this.getStatus = function (message, dbCollection) {
        dbCollection.aggregate([
            {
                $match: { createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } }
            },
            {
                $group: {
                    _id: null,
                    earliestDrink: { $min: "$createdAt" },
                    beerCount: { $sum: "$beer" },
                    wineCount: { $sum: "$wine" },
                    liquorCount: { $sum: "$liquor" }
                }
            }
        ]).toArray(
            function (err, result) {
                if (err) {
                    message.channel.send("Party Foul:  " + err);
                }

                const sums = result[0];
                const beerCount = sums.beerCount;
                const wineCount = sums.wineCount;
                const liquorCount = sums.liquorCount;
                const earliestDrink = sums.earliestDrink;

                const hoursDrinking = Math.round(Math.abs(new Date() - earliestDrink) / (60 * 60 * 1000) * 100) / 100

                const GenderConstant = 0.68
                const Weight = 240.0

                // BAC = (Standard Drinks * 0.06 * 100 * 1.055 / Weight * Gender Constant) ­ (0.015 * Hours)
                const BAC = Math.max(Math.round((((beerCount + wineCount + liquorCount) * 0.06 * 100 * 1.055 / Weight * GenderConstant) - (0.015 * hoursDrinking)) * 100) / 100, 0)

                const embed = new Discord.MessageEmbed()
                    .setColor('#DBE4EB')
                    .setAuthor("Shamebot Drinkin' Buddy")
                    .setThumbnail("https://findicons.com/files/icons/1202/futurama_vol_6_the_movies/256/steamboat_bender.png")
                    .setTitle("BAC: " + BAC + "%")
                    .setDescription("Started drinking " + minutesToHourMinuteString(hoursDrinking * 60) + " ago.")
                    .addFields(
                        { name: '🍺 Beer', value: beerCount, inline: true },
                        { name: '🍷 Wine', value: wineCount, inline: true },
                        { name: '🥃 Liqour', value: liquorCount, inline: true }
                    )

                message.channel.send(embed);
            })             
    }
}

module.exports = DrinkingManager;