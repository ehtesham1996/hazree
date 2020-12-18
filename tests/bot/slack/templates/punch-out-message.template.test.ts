import { punchOutMessage } from '@src/bot/slack/templates';
<<<<<<< HEAD
import { number, string } from 'superstruct';
=======
>>>>>>> 826861e7711e90863003561d020babaab8051b4e

describe('bot/slack/templates ==> punch out message template testing', () => {
  it('should return punch out message back from bot', () => {
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
            text: '*In Time*\n00-00-00 00:00:00\n*Last Session Duration*\n00:00\n*Total Sessions Today*\n0\n'
          },
          {
            type: 'mrkdwn',
            text: '*Out Time*\n00-00-00 00:00:00\n*Total Time Worked Today*\n00:00'
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
<<<<<<< HEAD
    const actual = punchOutMessage({});
=======
    const actual = punchOutMessage(
      {
        inTime: '00-00-00 00:00:00', outTime: '00-00-00 00:00:00', lastSessionDuration: 0, sessionCount: 0, totalHours: 0
      }
    );
>>>>>>> 826861e7711e90863003561d020babaab8051b4e
    expect(expected).toStrictEqual(actual);
  });
});
