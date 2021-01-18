/**
 * Source https://app.slack.com/block-kit-builder/TMZRX6PRU#%7B%22blocks%22:%5B%7B%22type%22:%22section%22,%22text%22:%7B%22type%22:%22mrkdwn%22,%22text%22:%22The%20phrasing%20of%20the%20timing%20for%20this%20reminder%20is%20unclear.%20You%20must%20include%20a%20complete%20time%20description.%20Some%20examples%20that%20work:%20%20*Epoch%20time%20back%20%601458678068%60*%20,%20%6020%60,%20%60in%205%20minutes%60,%20%60tomorrow%60,%20%60at%203:30pm%60,%20%60on%20Tuesday%60,%20%60or%20next%20week.%60%22%7D%7D%5D%7D
 *
 */
export function brbInvalidReminder(): Array<any> {
  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'The phrasing of the timing for this reminder is unclear. You must include a complete time description. Some examples that work:  *Epoch time back `1458678068`* , `20`, `in 5 minutes`, `tomorrow`, `at 3:30pm`, `on Tuesday`, `or next week.`'
      }
    }
  ];
}
