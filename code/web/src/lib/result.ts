export abstract class Result<T, E> {
    protected constructor(
        readonly _tag: "Success" | "Failure",
        protected readonly value: T | E
    ) {}

    static succeed<T>(data: T): Success<T> {
        return new Success(data);
    }

    static fail<E>(error: E): Failure<E> {
        return new Failure(error);
    }

    abstract isSuccess(): this is Success<T>;
    abstract isFailure(): this is Failure<E>;

    get data(): T {
        if (this.isSuccess()) return this.value;
        throw new Error("Cannot get data from a Failure");
    }

    get error(): E {
        if (this.isFailure()) return this.value;
        throw new Error("Cannot get error from a Success");
    }

    map<U>(f: (value: T) => U): Result<U, E> {
        return this.isSuccess()
            ? Result.succeed(f(this.data))
            : (this as unknown as Result<U, E>);
    }

    flatMap<U>(f: (value: T) => Result<U, E>): Result<U, E> {
        return this.isSuccess() ? f(this.data) : (this as unknown as Result<U, E>);
    }

    equals(that: unknown): boolean {
        return (
            that instanceof Result &&
            this._tag === that._tag &&
            this.value === that.value
        );
    }

    toJSON() {
        return {
            _tag: this._tag,
            [this._tag === "Success" ? "data" : "error"]: this.value,
        };
    }

    toString(): string {
        return JSON.stringify(this.toJSON());
    }

    [Symbol.for("nodejs.util.inspect.custom")]() {
        return this.toJSON();
    }
}

export class Success<T> extends Result<T, never> {
    constructor(data: T) {
        super("Success", data);
    }

    isSuccess(): this is Success<T> {
        return true;
    }

    isFailure(): this is Failure<never> {
        return false;
    }

    get data(): T {
        return this.value;
    }
}

export class Failure<E> extends Result<never, E> {
    constructor(error: E) {
        super("Failure", error);
    }

    isSuccess(): this is Success<never> {
        return false;
    }

    isFailure(): this is Failure<E> {
        return true;
    }

    get error(): E {
        return this.value;
    }
}