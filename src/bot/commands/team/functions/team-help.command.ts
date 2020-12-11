import { markDownMessage } from '@src/bot/slack/templates';
import { APP_NAME, UserCommand } from '@src/core';
import { UsersDocument } from '@src/database';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const teamHelp = async (_com: UserCommand, _user: UsersDocument): Promise<any> => markDownMessage(
  `>Available commands are:
    *To Create TEAM:*
      \`@${APP_NAME} team create *#TEAMNAME*\`
      *#TEAMNAME* : Name of the team .Should be unique and team must not exists previously by this name created by you
    ----------------------------------------------------------------------------------------------------
    *To Add Members to TEAM:*
      \`@${APP_NAME} team add *#TEAMNAME* @all\`
                      or 
      \`@${APP_NAME} team add *#TEAMNAME* @user @user @user....>\`

      *#TEAMNAME*: must exists or created previosuly
      1. if specified with all this will add all members from current channel to team
      2. if specified with @user will add that user to that team
    ----------------------------------------------------------------------------------------------------
      *To Remove Members from TEAM:*
      \`@${APP_NAME} team remove *#TEAMNAME* @user\`
      *#TEAMNAME*: must exists or created previosuly
      1. @user must be member of the team
    ----------------------------------------------------------------------------------------------------
    *To List TEAMS which you are member or admin:*
      \`@${APP_NAME} team list\`
    ----------------------------------------------------------------------------------------------------
    *To List TEAM member*
      \`@${APP_NAME} team member *#TEAMNAME*\`
      *#TEAMNAME*: must exists or created previosuly
      1. You must be the admin of this team to list members`
);
