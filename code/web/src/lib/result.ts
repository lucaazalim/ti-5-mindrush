/**
 * Represents a successful result.
 *
 * @template T The type of the data contained in the success result.
 */
export type Success<T> = {
  _tag: "Success";
  data: T;
};

/**
 * Represents a failed result.
 *
 * @template E The type of the error contained in the failure result.
 */
export type Failure<E> = {
  _tag: "Failure";
  error: E;
};

/**
 * Represents a result that can either be a success or a failure.
 *
 * @template T The type of the data in a success result.
 * @template E The type of the error in a failure result.
 */
export type Result<T, E> = Success<T> | Failure<E>;

/**
 * Creates a success result.
 *
 * @template T The type of the data in the success result.
 * @param data The data to include in the success result.
 * @returns A success result containing the provided data.
 */
export function succeed<T>(data?: T): Success<T> {
  return { _tag: "Success", data: data as T };
}

/**
 * Creates a failure result.
 *
 * @template E The type of the error in the failure result.
 * @param error The error to include in the failure result.
 * @returns A failure result containing the provided error.
 */
export function fail<E>(error: E): Failure<E> {
  return { _tag: "Failure", error };
}

/**
 * Checks if a result is a success.
 *
 * @template T The type of the data in the success result.
 * @template E The type of the error in the failure result.
 * @param result The result to check.
 * @returns True if the result is a success, false otherwise.
 */
export function isSuccess<T, E>(result: Result<T, E>): result is Success<T> {
  return result._tag === "Success";
}

/**
 * Checks if a result is a failure.
 *
 * @template T The type of the data in the success result.
 * @template E The type of the error in the failure result.
 * @param result The result to check.
 * @returns True if the result is a failure, false otherwise.
 */
export function isFailure<T, E>(result: Result<T, E>): result is Failure<E> {
  return result._tag === "Failure";
}
