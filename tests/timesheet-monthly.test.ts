import { handler } from '@src/api/functions/timesheets/timesheet-monthly';
import { APIGatewayEvent } from 'aws-lambda';
// eslint-disable-next-line import/no-unresolved
import * as context from 'aws-lambda-mock-context';

describe('lambda ==> timesheet-monthly function tests', () => {
  it('should return internal server error', async () => {
    const expected = {
      body: "{\"error\":true,\"success\":false,\"message\":\"Cannot destructure property `date` of 'undefined' or 'null'.\"}",
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Origin': '*'
      },
      isBase64Encoded: undefined,
      multiValueHeaders: undefined,
      statusCode: 500
    };

    const ctx = context.default();
    const evt = {};
    const actual = await handler(evt as APIGatewayEvent, ctx, null);
    expect(actual).toStrictEqual(expected);
  });

  it('should return bad request error for incorrect date given', async () => {
    const expected = {
      body: '{"error":true,"success":false,"message":"Please select correct month in format YYYY-MM ERR(BR-01)"}',
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Origin': '*'
      },
      isBase64Encoded: undefined,
      multiValueHeaders: undefined,
      statusCode: 400
    };

    const ctx = context.default();
    const evt = {} as APIGatewayEvent;
    evt.pathParameters = {
      date: '2020-21'
    };
    const actual = await handler(evt, ctx, null);
    expect(actual).toStrictEqual(expected);
  });
});
