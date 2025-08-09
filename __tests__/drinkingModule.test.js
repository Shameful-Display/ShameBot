const DrinkingManager = require('../modules/drinkingModule');

describe('drinkingModule', () => {
  test('addDrinks counts emojis and calls getStatus', (done) => {
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
      channel: { send: (embed) => { sent.push(embed); done(); } },
    };

    dm.addDrinks(message, dbCollection);
  });
});