const test = require('node:test');
const assert = require('node:assert/strict');
const TableCatcherManager = require('../modules/tableCatcherModule');

test('tableCatcherModule initializes and progresses state per channel', () => {
  const manager = new TableCatcherManager();

  const replies = [];
  const fakeChannel = { id: 'chan1', equals: (other) => other.id === 'chan1' };
  const fakeMessage = {
    channel: fakeChannel,
    reply: (text) => replies.push(text),
  };

  manager.tableCatcherReply(fakeMessage);
  assert.equal(replies.length, 1);
  const first = replies[0];
  assert.equal(typeof first, 'string');

  manager.tableCatcherReply(fakeMessage);
  assert.equal(replies.length, 2);
  assert.notEqual(replies[1], first);
});