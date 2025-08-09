const test = require('node:test');
const assert = require('node:assert/strict');
const DrinkingManager = require('../modules/drinkingModule');

test('drinkingModule addDrinks counts emojis and calls getStatus', (t, done) => {
  const dm = new DrinkingManager();

  const inserts = [];
  const dbCollection = {
    insertOne: (doc) => {
      inserts.push(doc);
      return Promise.resolve();
    },
    aggregate: () => ({ toArray: () => Promise.resolve([{ earliestDrink: new Date(Date.now() - 60*60*1000), beerCount: 1, wineCount: 2, liquorCount: 0 }]) }),
  };

  const sent = [];
  const message = {
    content: '!cheers 🍺🍷🍷',
    reply: (t) => sent.push(t),
    channel: { send: (embed) => { sent.push(embed); assert.ok(embed.title || embed.description); done(); } },
  };

  dm.addDrinks(message, dbCollection);
});