jest.mock('request', () => (url, cb) => {
  if (url.includes('hasgif')) {
    cb(null, null, JSON.stringify({ data: [{ embed_url: 'http://gif' }] }));
  } else {
    cb(null, null, JSON.stringify({ data: [] }));
  }
});

const GiphyManager = require('../modules/giphyModule');

jest.mock('../auth.json', () => ({ giphyAPIKey: 'key' }), { virtual: true });

describe('giphyModule', () => {
  test('sends URL when found', () => {
    const gm = new GiphyManager();
    const sent = [];
    const message = { cleanContent: '!gif hasgif', channel: { send: (u) => sent.push(u) }, reply: () => {} };

    gm.search(message);

    expect(sent[0]).toBe('http://gif');
  });

  test('sends fallback when not found', () => {
    const gm = new GiphyManager();
    const sent = [];
    const message = { cleanContent: '!gif nothing', channel: { send: (u) => sent.push(u) }, reply: (t, file) => { sent.push(file); return { catch: () => {} }; } };

    gm.search(message);

    expect(sent.length).toBe(1);
  });
});