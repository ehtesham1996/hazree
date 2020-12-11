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
});
