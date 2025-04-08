export type Success<T> = {
    _tag: "Success";
    data: T;
};

export type Failure<E> = {
    _tag: "Failure";
    error: E;
};

export type Result<T, E> = Success<T> | Failure<E>;

export function succeed<T>(data: T): Success<T> {
    return { _tag: "Success", data };
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

export function map<T, E, U>(
    result: Result<T, E>,
    f: (value: T) => U
): Result<U, E> {
    return isSuccess(result) ? succeed(f(result.data)) : result;
}

export function toJSON<T, E>(result: Result<T, E>): object {
    return isSuccess(result)
        ? { _tag: "Success", data: result.data }
        : { _tag: "Failure", error: result.error };
}

export function toString<T, E>(result: Result<T, E>): string {
    return JSON.stringify(toJSON(result));
}
