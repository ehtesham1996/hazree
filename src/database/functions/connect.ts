import { DatabaseConnectionError } from '@src/core/errors';
import { Context } from 'aws-lambda';
import * as mongoose from 'mongoose';

let isConnected: number;

export const connectToDatabase = async (context: Context): Promise<void> => {
  // Make sure to add this so you can re-use `conn` between function calls.
  // See https://www.mongodb.com/blog/post/serverless-development-with-nodejs-aws-lambda-mongodb-atlas
  context.callbackWaitsForEmptyEventLoop = false;

  if (isConnected) {
    console.log('=> using existing database connection');
    return;
  }
  console.log('=> using new database connection');
  try {
    const db = await mongoose.connect(process.env.DB_URI, { useNewUrlParser: true });
    isConnected = db.connections[0].readyState;
    return;
  } catch (error) {
    console.log('=> Database connection error occured');
    console.log(error);
    throw new DatabaseConnectionError();
  }
};
