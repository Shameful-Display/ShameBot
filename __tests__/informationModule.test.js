const InfoManager = require('../modules/informationModule');

describe('informationModule', () => {
  test('help replies with embed', () => {
    const bot = { guilds: { cache: new Map() }, channels: { cache: new Map() }, users: { cache: new Map() } };
    const info = new InfoManager(bot);
    const replies = [];
    const message = { reply: (embed) => replies.push(embed) };

    info.help(message);

    expect(replies.length).toBe(1);
    expect(replies[0].title).toContain('Bot Commands');
    expect(typeof replies[0].description).toBe('string');
  });

  test('about replies with version text', () => {
    const bot = { guilds: { cache: new Map() }, channels: { cache: new Map() }, users: { cache: new Map() } };
    const info = new InfoManager(bot);
    const replies = [];
    const message = { reply: (embed) => replies.push(embed) };

    info.about(message);

    expect(replies.length).toBe(1);
    expect(replies[0].description).toMatch(/ShameBot Version/);
  });
});