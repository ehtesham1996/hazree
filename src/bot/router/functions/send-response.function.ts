import { Request, Response } from 'express';
import * as AWS from 'aws-sdk';

const lambda = new AWS.Lambda();
export async function sendResponseAndSelfCall(req: Request, res: Response): Promise<void> {
  const { body, headers } = req;
  delete headers['content-length'];
  body.selfCall = true;
  const params = {
    FunctionName: `hazree-bot-${process.env.ENV}-app`,
    /* required */
    Payload: JSON.stringify({
      body,
      headers,
      httpMethod: 'POST',
      path: '/mention-call-back'
    })
  };

  console.log(params.Payload);
  lambda.invoke(params, (err, data) => {
    if (err) {
      console.log(
        'Error ocoured while invoke lambda',
        err
      );
    }
    console.log('lambda invoked');
    console.log('response from lambda is ', data);
  });
  setTimeout(() => {
    res.send('ok');
  }, 1000);
}
