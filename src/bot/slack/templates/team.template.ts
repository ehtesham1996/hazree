/**
 * Source https://api.slack.com/tools/block-kit-builder?mode=message&blocks=%5B%7B%22type%22%3A%22section%22%2C%22text%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22You%27ve%20punched%20in.%20To%20punch%20out%20type%20%60out%60.%20Type%20%60timesheet%60%20to%20view%20your%20timesheet%20for%20the%20day.%22%7D%7D%5D
 *
 */

import { APP_NAME } from '@src/core';
import { UsersDocument } from '@src/database';

export function teamInvalidParameters(): Array<any> {
  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `>Incomplete team command.\n Please try command \`@${APP_NAME} team help\``
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

export function teamMemberListMessage(members: UsersDocument[]): Array<any> {
  const blocks: any = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: 'Team Members',
        emoji: true
      }
    },
    {
      type: 'divider'
    }
  ];

  if (members.length === 0) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*No Members*'
      }
    });
  }

  members.forEach((member, index) => {
    blocks.push(
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `${index + 1}. *${member.name}*`
        }
      }
    );
  });

  return blocks;
}
