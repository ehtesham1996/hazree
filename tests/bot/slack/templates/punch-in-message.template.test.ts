import { punchInMessage } from '@src/bot/slack/templates';

describe('bot/slack/templates ==> punch in message template testing', () => {
  it('should return punch in message back from bot', () => {
    const expected = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: ">You've punched in. To punch out type `out`. Type `timesheet` to view your timesheet for the day."
        }
      }
    ];
    const actual = punchInMessage();
    expect(expected).toStrictEqual(actual);
  });
});
