import { punchOutMessage } from '@src/bot/slack/templates';
import { string } from 'superstruct';

describe('bot/slack/templates ==> punch in message template testing', () => {
  it('should return punch in message back from bot', () => {
    const expected = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: ">You've punched out. To punch in type `in`. Type `timesheet` to view your timesheet for the day."
        }
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: '*In Time*\n\n*Last Session Duration*\n\n*Total Sessions Today*\n\n'
          },
          {
            type: 'mrkdwn',
            text: '*Out Time*\n\n*Total Time Worked Today*\n'
          }
        ]
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              emoji: true,
              text: 'Comment'
            },
            style: 'primary',
            value: 'click_me_123'
          }
        ]
      }
    ];
    const actual = punchOutMessage([
      {
        inTime: '00-00-00 00:00:00', outTime: '00-00-00 00:00:00', lastSessionDuration: 0, sessionCount: 0, totalHours: 0
      }

    ]);
    expect(expected).toStrictEqual(actual);
  });
});
