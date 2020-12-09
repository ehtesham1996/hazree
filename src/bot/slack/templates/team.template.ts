/**
 * Source https://api.slack.com/tools/block-kit-builder?mode=message&blocks=%5B%7B%22type%22%3A%22section%22%2C%22text%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22You%27ve%20punched%20in.%20To%20punch%20out%20type%20%60out%60.%20Type%20%60timesheet%60%20to%20view%20your%20timesheet%20for%20the%20day.%22%7D%7D%5D
 *
 */

export function teamInvalidParameters(): Array<any> {
  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '>Incomplete team command.\n\nCOMMANDS:\n\t`@create`\t\t\t#creates a new team on hazree portal\n\t`@add-members`\t\t\t#add members to existing team\nEXAMPLES:\n\t`@hazree team create TeamName`'
      }
    }
  ];
}

export function teamAlreadyExists(teamName): Array<any> {
  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `>Team \`${teamName}\` already exists!`
      }
    }
  ];
}

export function teamCreateMessage(teamName): Array<any> {
  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `>Team \`${teamName}\` have been successfully created.`
      }
    }
  ];
}

export function teamCreateFailMessage(): Array<any> {
  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '>Error: Cannot create team!'
      }
    }
  ];
}

export function teamUserAddSuccessMessage(teamName: string, users: Array<string>): Array<any> {
  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `>Successfully added members \`${users.join(', ')}\`\n\tInto the team \`${teamName}\``
      }
    }
  ];
}

export function teamUserAddFailMessage(message = ''): Array<any> {
  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `>Error: Cannot add members!\n\t${message}`
      }
    }
  ];
}
