type ErrorProcessing<E, D> = (error: E) => D;
type ErrorProcessingAsync<E, D> = (error: E) => Promise<D>;

export class Result<E, D> {
  protected readonly error: E | null;
  protected readonly data: D;

  constructor(error: E | null = null, data: D) {
    this.error = error;
    this.data = data;
  }

  unwrap(): D | never {
    if (this.error !== null) {
      throw this.error;
    }
    return this.data;
  }

  unwrapAsync(): Promise<D | E> {
    if (this.error !== null) {
      return Promise.reject(this.error);
    }
    return Promise.resolve(this.data);
  }

  onError(func: ErrorProcessing<E, D>): D {
    if (this.error !== null) {
      return func(this.error);
    }
    return this.data;
  }

  onErrorAsync(func: ErrorProcessingAsync<E, D>): Promise<D> {
    if (this.error !== null) {
      return func(this.error);
    }
    return Promise.resolve(this.data);
  }

  isOk(): boolean {
    return this.error === null;
  }

  isFail(): boolean {
    return this.error !== null;
  }
}

export class ResultOK<D> extends Result<null, D> {
  constructor(data: D) {
    super(null, data);
  }

  unwrap(): D {
    return this.data;
  }

  unwrapAsync(): Promise<D> {
    return Promise.resolve(this.data);
  }
}

export class ResultFAIL<E> extends Result<E, undefined> {
  constructor(error: E) {
    super(error, void 0);
  }

  unwrap(): never {
    throw this.error;
  }

  unwrapAsync(): Promise<E> {
    return Promise.reject(this.error);
  }
}

export const ResultOk = <D>(data: D) => new ResultOK(data);

export const ResultFail = <E>(error: E) => new ResultFAIL(error);
