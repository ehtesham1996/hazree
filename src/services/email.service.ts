import { APP_NAME, SOURCE_EMAIL } from '@src/core';
import AWS from 'aws-sdk';
import { SendEmailRequest } from 'aws-sdk/clients/ses';

export const sendTeamJoinInvitation = async (teamName: string, emails: string[]): Promise<void> => {
  if (emails.length === 0) return;

  const params: SendEmailRequest = {
    Destination: {
      ToAddresses: emails
    },
    Message: { /* required */
      Body: { /* required */
        // Html: {
        //   Charset: "UTF-8",
        //   Data: "HTML_FORMAT_BODY"
        // },
        Text: {
          Charset: 'UTF-8',
          Data: `You are invited to join team ${teamName}.\nPlease join via https://dev.d2313v7uzw83of.amplifyapp.com/`
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `${APP_NAME} Team Join Invitation`
      }
    },
    Source: SOURCE_EMAIL /* required */
  };

  try {
    const sendResponse = await new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();
    console.log(sendResponse);
  } catch (error) {
    console.log('Email sending error', error);
  }
};
