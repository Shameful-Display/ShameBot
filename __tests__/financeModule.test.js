jest.mock('axios', () => jest.fn());
const axios = require('axios');

const FinanceManager = require('../modules/financeModule');

jest.mock('../auth.json', () => ({ financeKey: 'key' }), { virtual: true });

describe('financeModule', () => {
  test('stockInfo replies with embed on success', async () => {
    const bot = { user: { setPresence: jest.fn() } };
    const fm = new FinanceManager(bot);

    axios.mockResolvedValue({ data: { 'Global Quote': { '01. symbol': 'AAPL', '05. price': '100.00', '10. change percent': '1.23' } } });

    const replies = [];
    const message = { cleanContent: '!stock AAPL', reply: (embed) => replies.push(embed) };

    await fm.stockInfo(message);

    expect(replies.length).toBe(1);
    expect(replies[0].title).toContain('AAPL Stock Info');
  });
});