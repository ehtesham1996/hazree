/**
 * @description database error description class.This defines
 *              the database error with message DB-01 code
 */
export class DatabaseConnectionError extends Error {
  constructor() {
    super('Oops! seems like we\'re having difficulties.Please try again later. ERR(DB-01)');
  }
}
