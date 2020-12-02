export class UserNotFound extends Error {
  constructor(id: string) {
    super(`User not found with _id: ${id}`);
  }
}
