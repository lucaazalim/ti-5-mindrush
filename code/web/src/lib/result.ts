export type Success<T> = {
  _tag: "Success";
  data: T;
};

export type Failure<E> = {
  _tag: "Failure";
  error: E;
};

export type Result<T, E> = Success<T> | Failure<E>;

export function succeed<T>(data?: T): Success<T> {
  return { _tag: "Success", data: data as T };
}

export function fail<E>(error: E): Failure<E> {
  return { _tag: "Failure", error };
}

export function isSuccess<T, E>(result: Result<T, E>): result is Success<T> {
  return result._tag === "Success";
}

export function isFailure<T, E>(result: Result<T, E>): result is Failure<E> {
  return result._tag === "Failure";
}
