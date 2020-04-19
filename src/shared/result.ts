import Guard from './guard';

export default class Result<T> {
  public readonly isSuccess: boolean;

  public readonly isFailure: boolean;

  public readonly error: T | string | null;

  private readonly value: T | null;

  private constructor(
    isSuccess: boolean,
    error: T | string | null,
    value: T | null
  ) {
    if (isSuccess) {
      if (error) {
        throw new Error('Result cannot be successful with an error.');
      }

      this.isSuccess = true;
      this.isFailure = false;
      this.value = value;
      this.error = null;
    } else {
      if (!error) {
        throw new Error('Result cannot be non-successful without an error.');
      }

      const guardResult = Guard.againstNullOrUndefined({
        argument: error,
        argumentName: 'error',
      });
      if (!guardResult.success) {
        throw new Error(guardResult.message);
      }

      this.isSuccess = false;
      this.isFailure = true;
      this.value = null;
      this.error = error;
    }
  }

  public getValue(): T {
    if (this.isFailure) {
      throw new Error(
        `getValue() not possible, result failed with error: ${this.error}`
      );
    }

    return this.value as T;
  }

  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, null, value || null);
  }

  public static fail<U>(error: string): Result<U> {
    return new Result<U>(false, error, null);
  }

  public static combine(results: Result<any>[]): Result<any> {
    // eslint-disable-next-line no-restricted-syntax
    for (const result of results) {
      if (result.isFailure) {
        return result;
      }
    }

    return Result.ok<any>();
  }
}
