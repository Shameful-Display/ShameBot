const Discord = require('discord.js');

function hourMinuteString(hours) {
  const rhours = Math.floor(hours);
  const minutes = (hours - rhours) * 60;
  const rminutes = Math.round(minutes);
  return `${rhours}h ${rminutes}m `;
}

const DrinkingManager = function drinkingManager() {
  this.addDrinks = function addDrinks(message, dbCollection) {
    let beerCount = 0;
    let wineCount = 0;
    let liquorCount = 0;

    beerCount = (message.content.match(/🍺/g) || []).length;
    wineCount = (message.content.match(/🍷/g) || []).length;
    liquorCount = (message.content.match(/🥃/g) || []).length;

    if (beerCount === 0 && wineCount === 0 && liquorCount === 0) {
      message.reply("I'm only drinking a 🍺, 🍷, or 🥃");
      return;
    }

    const doc = {
      createdAt: new Date(),
      beer: beerCount,
      wine: wineCount,
      liquor: liquorCount,
    };

    dbCollection.insertOne(doc)
      .then(() => {
        this.getStatus(message, dbCollection);
      })
      .catch((err) => {
        message.channel.send(`Party Foul: ${err}`);
      });
  };

  this.getStatus = function getStatus(message, dbCollection) {
    dbCollection.aggregate([
      {
        $match: { createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
      },
      {
        $group: {
          _id: null,
          earliestDrink: { $min: '$createdAt' },
          beerCount: { $sum: '$beer' },
          wineCount: { $sum: '$wine' },
          liquorCount: { $sum: '$liquor' },
        },
      },
    ]).toArray(
      (err, result) => {
        if (err) {
          message.channel.send(`Party Foul:  ${err}`);
        }

        const sums = result[0];
        const { beerCount } = sums;
        const { wineCount } = sums;
        const { liquorCount } = sums;
        const { earliestDrink } = sums;

        const hourFactor = 60 * 60 * 1000;
        const hoursDrinking = Math.abs(new Date() - earliestDrink) / hourFactor;

        // BAC = BAC = [Alcohol consumed in grams / (Body weight in grams x R)] X 100
        const drinkCount = beerCount + wineCount + liquorCount;
        const alcohol = drinkCount * 14;
        const bodyWeight = 240 * 454;
        const r = 0.68;
        const metabolized = hoursDrinking * 0.015;
        let newBac = ((alcohol / (bodyWeight * r)) * 100) - metabolized;
        newBac = Math.max(newBac, 0);
        newBac = newBac.toFixed(2);

        const embed = new Discord.MessageEmbed()
          .setColor('#DBE4EB')
          .setAuthor("Shamebot Drinkin' Buddy")
          .setThumbnail('https://findicons.com/files/icons/1202/futurama_vol_6_the_movies/256/steamboat_bender.png')
          .setTitle(`BAC: ${newBac}%`)
          .setDescription(`Started drinking ${hourMinuteString(hoursDrinking)} ago.`)
          .addFields(
            { name: '🍺 Beer', value: beerCount, inline: true },
            { name: '🍷 Wine', value: wineCount, inline: true },
            { name: '🥃 Liqour', value: liquorCount, inline: true },
          );

        message.channel.send(embed);
      },
    );
  };
};

module.exports = DrinkingManager;
