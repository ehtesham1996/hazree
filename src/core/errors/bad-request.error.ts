/**
 * @description bad request error description class.This defines
 *              bad request when one or more paramaters are incorreect
 */
export class BadRequestError extends Error {
  statusCode: number;

  constructor(message = 'One or more parameters are incorrect.') {
    super(`${message} ERR(BR-01)`);
    this.statusCode = 400;
  }
}
