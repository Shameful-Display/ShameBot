const test = require('node:test');
const assert = require('node:assert/strict');
const HonorManager = require('../modules/honorModule');

test('honorModule initialize inserts when missing and returns honor', (t, done) => {
  const hm = new HonorManager();

  const inserted = [];
  const honorCollection = {
    findOne: (query, cb) => cb(null, null),
    insertOne: (doc) => { inserted.push(doc); },
    find: () => ({ each: (cb) => { cb(null, { upvotes: 0, downvotes: 0 }); done(); } }),
  };

  const message = {
    channel: { guild: { id: 'guild1' } },
    mentions: { users: { array: () => [{ id: 'user1', username: 'u' }] } },
    reply: () => {},
  };

  hm.initializeAndReturnHonor(message, honorCollection);
  assert.equal(inserted.length, 1);
});

test('honorModule update increments on ++ and --', () => {
  const hm = new HonorManager();
  const updates = [];
  const honorCollection = {
    updateOne: (q, u, o) => updates.push({ q, u, o }),
  };

  const message = {
    channel: { guild: { id: 'guild1' } },
    content: '<@user2> ++ and <@!user3> --',
    mentions: { users: { array: () => [{ id: 'user2', equals: () => false }, { id: 'user3', equals: () => false }] } },
    author: { id: 'me' },
  };

  hm.updateHonor(message, honorCollection);
  assert.equal(updates.length, 2);
});