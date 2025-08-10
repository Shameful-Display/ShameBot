const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

// Ensure auth.json exists for module resolution
const authPath = path.join(process.cwd(), 'auth.json');
if (!fs.existsSync(authPath)) {
  fs.writeFileSync(authPath, JSON.stringify({ financeKey: 'key' }));
}

// Stub discord.js used by the module
const discordStubPath = require.resolve('discord.js');
require.cache[discordStubPath] = {
  exports: {
    MessageEmbed: class {
      constructor() {
        this.title = undefined;
        this.color = undefined;
        this.description = undefined;
        this.fields = [];
      }

      setTitle(t) { this.title = t; return this; }

      setColor(c) { this.color = c; return this; }

      setDescription(d) { this.description = d; return this; }

      addField(n, v, i) { this.fields.push({ name: n, value: v, inline: i }); return this; }
    },
  },
};

// Install an axios stub module into the require cache before requiring the module under test
let axiosImpl = async () => ({ data: {} });
require.cache[require.resolve('axios')] = { exports: (...args) => axiosImpl(...args) };

const FinanceManager = require('../modules/financeModule');

test('financeModule stockInfo replies with embed on success', async () => {
  const bot = { user: { setPresence: () => {} } };
  const fm = new FinanceManager(bot);

  axiosImpl = async () => ({
    data: {
      'Global Quote': {
        '01. symbol': 'AAPL',
        '05. price': '100.00',
        '10. change percent': '1.23',
      },
    },
  });

  const replies = [];
  const message = { cleanContent: '!stock AAPL', reply: (embed) => replies.push(embed) };

  await fm.stockInfo(message);

  assert.equal(replies.length, 1);
  assert.match(replies[0].title, /AAPL Stock Info/);
});