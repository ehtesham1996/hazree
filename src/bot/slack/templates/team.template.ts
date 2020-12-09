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
        text: '>Incomplete team command.\n\nCOMMANDS:\n\t`team create`\t\t\t#Creates a new team on hazree portal\n\t`team add Team Name @all`\t\t\t#Adds all members to existing team\n\t`team add Team Name @member1 @member2`\t\t\t#Adds mentioned members to existing team\n\t`team remove Team Name @member1 @member2`\t\t\t#Removes mentioned members from existing team\n\t`team list`\t\t\t#Lists all your teams'
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

export function teamUserRemoveSuccessMessage(teamName: string, users: Array<string>): Array<any> {
  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `>Removed members \`${users.join(', ')}\`\n\tFrom the team \`${teamName}\``
      }
    }
  ];
}

export function teamUserRemoveFailMessage(message = ''): Array<any> {
  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `>Error: Cannot remove members!\n\t${message}`
      }
    }
  ];
}

export function teamListSuccessMessage(teamsList: Array<string>): Array<any> {
  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `>Your teams \`${teamsList.join(', ')}\``
      }
    }
  ];
}

export function teamNoListMessage(): Array<any> {
  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '>You don\'t have any teams under you.'
      }
    }
  ];
}

export function teamListFailMessage(message = ''): Array<any> {
  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `>Error: Cannot get teams list!\n\t${message}`
      }
    }
  ];
}
