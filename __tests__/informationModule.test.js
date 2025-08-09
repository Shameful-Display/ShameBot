const test = require('node:test');
const assert = require('node:assert/strict');
const InfoManager = require('../modules/informationModule');

test('informationModule help replies with embed', () => {
  const bot = { guilds: { cache: new Map() }, channels: { cache: new Map() }, users: { cache: new Map() } };
  const info = new InfoManager(bot);
  const replies = [];
  const message = { reply: (embed) => replies.push(embed) };

  info.help(message);

  assert.equal(replies.length, 1);
  assert.match(replies[0].title, /Bot Commands/);
  assert.equal(typeof replies[0].description, 'string');
});

test('informationModule about replies with version text', () => {
  const bot = { guilds: { cache: new Map() }, channels: { cache: new Map() }, users: { cache: new Map() } };
  const info = new InfoManager(bot);
  const replies = [];
  const message = { reply: (embed) => replies.push(embed) };

  info.about(message);

  assert.equal(replies.length, 1);
  assert.match(replies[0].description, /ShameBot Version/);
});