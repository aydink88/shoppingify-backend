import AppError from './appError.js';

export function checkOwner(ownerIdOfSomething, requestingUserId) {
  if (ownerIdOfSomething !== requestingUserId) {
    throw new AppError('unauthorized operation', 401);
  }
}
