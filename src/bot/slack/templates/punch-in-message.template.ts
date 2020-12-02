/**
 * Source https://api.slack.com/tools/block-kit-builder?mode=message&blocks=%5B%7B%22type%22%3A%22section%22%2C%22text%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22You%27ve%20punched%20in.%20To%20punch%20out%20type%20%60out%60.%20Type%20%60timesheet%60%20to%20view%20your%20timesheet%20for%20the%20day.%22%7D%7D%5D
 *
 */

export function punchInMessage(): Array<any> {
  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: ">You've punched in. To punch out type `out`. Type `timesheet` to view your timesheet for the day."
      }
    }
  ];
}
