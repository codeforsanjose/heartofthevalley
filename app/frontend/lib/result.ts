export type Result<T, E extends Error> = { success: true; value: T } | { success: false; error: E };

export const makeResult = <T, E extends Error>(result: Result<T, E>): Result<T, E> => result;

export const isSuccess = <T, E extends Error>(result: Result<T, E>): result is { success: true; value: T } =>
  result.success;
