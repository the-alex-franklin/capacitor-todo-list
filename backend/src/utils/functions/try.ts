type Success<T> = {
	success: true;
	failure: false;
	data: T;
};

type Failure = {
	success: false;
	failure: true;
	error: Error;
};

type Either<T extends Success<unknown>, U extends Failure = Failure> = T | U;

function createSuccess<T>(data: T): Success<T> {
	return { success: true, failure: false, data };
}

function createFailure(error: unknown): Failure {
	if (error instanceof Error) return { success: false, failure: true, error };
	return { success: false, failure: true, error: new Error(JSON.stringify(error)) };
}

export function Try<T>(fn: () => Promise<T>): Promise<Either<Success<T>>>;
export function Try<T>(fn: () => T): Either<Success<T>>;
export function Try<T>(fn: (() => T) | (() => Promise<T>)): Either<Success<T>> | Promise<Either<Success<T>>> {
	try {
		const result = fn();
		if (result instanceof Promise) {
			return result
				.then(createSuccess)
				.catch(createFailure);
		}

		return createSuccess(result);
	} catch (error: unknown) {
		return createFailure(error);
	}
}
