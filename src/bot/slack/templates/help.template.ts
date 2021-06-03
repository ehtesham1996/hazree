/**
 * Source https://app.slack.com/block-kit-builder/TMZRX6PRU#%7B%22blocks%22:%5B%7B%22type%22:%22section%22,%22text%22:%7B%22type%22:%22mrkdwn%22,%22text%22:%22The%20phrasing%20of%20the%20timing%20for%20this%20reminder%20is%20unclear.%20You%20must%20include%20a%20complete%20time%20description.%20Some%20examples%20that%20work:%20%20*Epoch%20time%20back%20%601458678068%60*%20,%20%6020%60,%20%60in%205%20minutes%60,%20%60tomorrow%60,%20%60at%203:30pm%60,%20%60on%20Tuesday%60,%20%60or%20next%20week.%60%22%7D%7D%5D%7D
 *
 */
export function helpMarkDown(): Array<any> {
  return [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: ':information_source: Hazree Guide',
        emoji: true
      }
    },
    {
      type: 'divider'
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*Registration* \nTo register with Hazree use the following command.\n `@Hazree register`.\n\n Your Hazree account will be created and credentials will be sent you via email that is linked to your current workspace account that you can use to login on https://hazree.softoo-dev.com.'
      }
    },
    {
      type: 'divider'
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*Punch IN*\nTo start your day please use the following command, after anytime midnight 00:00 hours new day starts \n`@Hazree in` \n\n You will receive personal message from Hazree bot for feedback.'
      }
    },
    {
      type: 'divider'
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*Take a break*\nTo stop working for a while or to take break please use the following command \n`@Hazree brb` \n\n You will receive personal message from Hazree bot for feedback.'
      }
    },
    {
      type: 'divider'
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*Continue Working Again*\nTo start your session again use the following command  \n`@Hazree back` \n\n You will receive personal message from Hazree bot for feedback.'
      }
    },
    {
      type: 'divider'
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*Punch OUT*\nTo finish your day or log off use the following command  \n`@Hazree out` \n\n You will receive personal message from Hazree bot for feedback.'
      }
    },
    {
      type: 'divider'
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*Timesheets*\nTimesheets can be viewed on portal or via command.\n1. To view timesheet for today use the following command \n   `@Hazree timesheet` \n\n2. You can use timesheet command with the following pattern.\n `@Hazree timesheet YYYY MM` or `@Hazree timesheet YYYY MM DD` \n*YYYY* = year\n *MM* = month \n *DD* = day \n e.g to obtain time sheet for month of june `@Hazree timesheet 2021 06` or to obtain timesheet for a specific date `@Hazree timesheet 2021 06 02`'
      }
    },
    {
      type: 'divider'
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*Just for fun*\nYou can ask Hazree to tell you a joke via `@Hazree joke`'
      }
    }
  ];
}
