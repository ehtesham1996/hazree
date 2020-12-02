/**
 * source https://api.slack.com/tools/block-kit-builder?mode=message&blocks=%5B%7B%22type%22%3A%22section%22%2C%22text%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22%24%7Bmrkdown%7D%22%7D%7D%5D
 */
export function markDownMessage(mrkdown: string): Array<any> {
  return ([
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `${mrkdown}`
      }
    }
  ]);
}
