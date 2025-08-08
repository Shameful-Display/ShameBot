const TableCatcherManager = require('../modules/tableCatcherModule');

describe('tableCatcherModule', () => {
  test('initializes and progresses state per channel', () => {
    const manager = new TableCatcherManager();

    const replies = [];
    const fakeChannel = { id: 'chan1', equals: (other) => other.id === 'chan1' };
    const fakeMessage = {
      channel: fakeChannel,
      reply: (text) => replies.push(text),
    };

    manager.tableCatcherReply(fakeMessage);
    expect(replies.length).toBe(1);
    const first = replies[0];
    expect(typeof first).toBe('string');

    manager.tableCatcherReply(fakeMessage);
    expect(replies.length).toBe(2);
    expect(replies[1]).not.toEqual(first);
  });
});