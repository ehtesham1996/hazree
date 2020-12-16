/**
 * Source https://api.slack.com/tools/block-kit-builder?mode=message&blocks=%5B%7B%22type%22%3A%22section%22%2C%22text%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22You%27ve%20punched%20out.%20To%20punch%20in%20type%20%60in%60.%20Type%20%60timesheet%60%20to%20view%20your%20timesheet%20for%20the%20day.%22%7D%7D%2C%7B%22type%22%3A%22section%22%2C%22fields%22%3A%5B%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22*In%20Time*%5Cn%24%7BinTime%7D%5Cn*Last%20Session%20Duration*%5Cn%24%7BlastSessionDuration%7D%5Cn*Total%20Sessions%20Today*%5Cn%24%7BsessionCount%7D%5Cn%22%7D%2C%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22*Out%20Time*%5Cn%24%7BoutTime%7D%5Cn*Total%20Time%20Worked%20Today*%5Cn%24%7BtotalHours%7D%22%7D%5D%7D%2C%7B%22type%22%3A%22actions%22%2C%22elements%22%3A%5B%7B%22type%22%3A%22button%22%2C%22text%22%3A%7B%22type%22%3A%22plain_text%22%2C%22emoji%22%3Atrue%2C%22text%22%3A%22Comment%22%7D%2C%22style%22%3A%22primary%22%2C%22value%22%3A%22click_me_123%22%7D%5D%7D%5D
 *
 */
function convert(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  return `${hours < 10 ? `0${hours}` : hours}:${mins < 10 ? `0${mins}` : mins}`;
}
export function monthlyTimesheetTemplate({
  date = 'YYYY/MM/DD', inTime = '00-00-00 00:00:00', outTime = '00-00-00 00:00:00', totalHours = 0
}): Array<any> {
  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*${date}* : In-Time : *${inTime}*, Out-Time : *${outTime}*, Total-Hours : *${convert(totalHours)}*`
      }
    }
  ];
}
