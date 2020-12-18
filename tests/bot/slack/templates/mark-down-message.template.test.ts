import { markDownMessage } from '@src/bot/slack/templates';

describe('bot/slack/templates ==> mark down message template testing', () => {
  it('should return markdown block with the supplied string', () => {
    const expected = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: 'test-message'
        }
      }
    ];
    const actual = markDownMessage('test-message');
    expect(expected).toStrictEqual(actual);
  });
});
