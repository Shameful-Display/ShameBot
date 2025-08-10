const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

// Ensure auth.json exists for module resolution
const authPath = path.join(process.cwd(), 'auth.json');
if (!fs.existsSync(authPath)) {
  fs.writeFileSync(authPath, JSON.stringify({ giphyAPIKey: 'key' }));
}

// stub request before requiring module
const requestStub = (url, cb) => {
  if (url.includes('hasgif')) {
    cb(null, null, JSON.stringify({ data: [{ embed_url: 'http://gif' }] }));
  } else {
    cb(null, null, JSON.stringify({ data: [] }));
  }
};
require.cache[require.resolve('request')] = { exports: requestStub };

const GiphyManager = require('../modules/giphyModule');

test('giphyModule sends URL when found', () => {
  const gm = new GiphyManager();
  const sent = [];
  const message = {
    cleanContent: '!gif hasgif',
    channel: { send: (u) => sent.push(u) },
    reply: () => {},
  };

  gm.search(message);

  assert.equal(sent[0], 'http://gif');
});

test('giphyModule sends fallback when not found', () => {
  const gm = new GiphyManager();
  const sent = [];
  const message = {
    cleanContent: '!gif nothing',
    channel: { send: (u) => sent.push(u) },
    reply: (t, file) => { sent.push(file); return { catch: () => {} }; },
  };

  gm.search(message);

  assert.equal(sent.length, 1);
});