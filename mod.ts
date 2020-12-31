type ErrorProcessing<Error, Data> = (error: Error) => Data;
type ErrorProcessingAsync<Error, Data> = (error: Error) => Promise<Data>;

export class Result<Error, Data> {
  private readonly error: Error | null;
  private readonly data: Data;

  constructor(error: Error | null = null, data: Data) {
    this.error = error;
    this.data = data;
  }

  unwrap(): Data {
    if (this.error !== null) {
      throw this.error;
    }
    return this.data;
  }

  unwrapAsync(): Promise<Data> {
    if (this.error !== null) {
      return Promise.reject(this.error);
    }
    return Promise.resolve(this.data);
  }

  onError(func: ErrorProcessing<Error, Data>): Data {
    if (this.error !== null) {
      return func(this.error);
    }
    return this.data;
  }

  async onErrorAsync(func: ErrorProcessingAsync<Error, Data>): Promise<Data> {
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

export class ResultOK<Data> extends Result<null, Data> {
  constructor(data: Data) {
    super(null, data);
  }
}

export class ResultFAIL<Error> extends Result<Error, undefined> {
  constructor(error: Error) {
    super(error, void 0);
  }
}

export const ResultOk = <Data>(data: Data) => new ResultOK(data);

export const ResultFail = <Error>(error: Error) => new ResultFAIL(error);
