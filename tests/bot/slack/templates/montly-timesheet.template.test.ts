import { monthlyTimesheetTemplate } from '@src/bot/slack/templates';

describe('bot/slack/templates ==> montly timesheet list template testing', () => {
  it('should return montly timesheet list message test', () => {
    const expected = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*YYYY/MM/DD* : In-Time : *00-00-00 00:00:00*, Out-Time : *00-00-00 00:00:00*, Total-Hours : *00:00*'
        }
      }
    ];
    const actual = monthlyTimesheetTemplate({});
    expect(expected).toStrictEqual(actual);
  });
});
