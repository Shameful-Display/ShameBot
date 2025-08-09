const MemeManager = require('../modules/memeRepliesModule');

describe('memeRepliesModule', () => {
  test('koolaidReply sends image and sets presence', () => {
    const bot = { user: { setPresence: jest.fn() } };
    const mm = new MemeManager(bot);
    const sent = [];
    const message = { reply: (text, attachment) => { sent.push({ text, attachment }); return { catch: () => {} }; } };

    mm.koolaidReply(message);

    expect(sent.length).toBe(1);
    expect(sent[0].text).toMatch(/Oh Yeah!/);
    expect(sent[0].attachment.path).toContain('modules/memeImages/koolaid.jpg');
    expect(bot.user.setPresence).toHaveBeenCalled();
  });
});