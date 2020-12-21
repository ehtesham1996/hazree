/* eslint-disable max-classes-per-file */
/**
 * @description http error class that throws error with statusCode
 */
export class HttpError extends Error {
  statusCode: number;

  constructor(message = 'Unable to complete your request', statusCode: number) {
    super(`${message}`);
    this.statusCode = statusCode;
  }
}

/**
 * @description bad request error description class.This defines
 *              bad request when one or more paramaters are incorreect
 */
export class BadRequestError extends HttpError {
  constructor(message = 'One or more parameters are incorrect.') {
    super(`${message} ERR(BR-01)`, 400);
  }
}

/**
 * @description conflict request error description class.This defines
 *              conflict request when source already exists
 */
export class HttpAlreadyExistsError extends HttpError {
  constructor(message = 'The resource you are trying to create already exists') {
    super(`${message} ERR(CR-01)`, 409);
  }
}
