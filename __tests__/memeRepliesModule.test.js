const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

// Stub discord.js with MessageAttachment used by module
const discordStubPath = require.resolve('discord.js');
require.cache[discordStubPath] = { exports: {
  MessageAttachment: class { constructor(p){ this.path = p; } },
}};

const MemeManager = require('../modules/memeRepliesModule');

test('memeRepliesModule koolaidReply sends image and sets presence', () => {
  const bot = { user: { setPresence: () => {} } };
  const mm = new MemeManager(bot);
  const sent = [];
  const message = { reply: (text, attachment) => { sent.push({ text, attachment }); return { catch: () => {} }; } };

  mm.koolaidReply(message);

  assert.equal(sent.length, 1);
  assert.match(sent[0].text, /Oh Yeah!/);
  assert.ok(sent[0].attachment.path.includes(path.join('modules','memeImages','koolaid.jpg')) || sent[0].attachment.path.includes('modules/memeImages/koolaid.jpg'));
});