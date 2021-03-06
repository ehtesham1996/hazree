import { timesheetTemplate } from '@src/bot/slack/templates';

describe('bot/slack/templates ==> timesheet list template testing', () => {
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
    const actual = timesheetTemplate({});
    expect(expected).toStrictEqual(actual);
  });
});
