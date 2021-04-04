export namespace types {
  export type Result<DataType, ErrorType> =
    | ResultOK<DataType>
    | ResultFAIL<ErrorType>;
  export type ResultAsync<DataType, ErrorType> = Promise<
    Result<DataType, ErrorType>
  >;
}

export class Result<DataType, ErrorType> {
  protected readonly data: DataType;
  protected readonly error: ErrorType;

  constructor(data: DataType, error: ErrorType) {
    this.data = data;
    this.error = error;
  }
}

export class ResultOK<DataType> extends Result<DataType, undefined> {
  constructor(data: DataType) {
    super(data, void 0);
  }

  unwrap(): DataType {
    return this.data;
  }

  isOk(): boolean {
    return true;
  }

  isFail(): boolean {
    return false;
  }
}

export class ResultFAIL<ErrorType> extends Result<undefined, ErrorType> {
  constructor(error: ErrorType) {
    super(void 0, error);
  }

  unwrap(): never {
    throw this.error;
  }

  isOk(): boolean {
    return false;
  }

  isFail(): boolean {
    return true;
  }
}

export const ResultOk = <DataType>(data: DataType) => new ResultOK(data);

export const ResultFail = <ErrorType>(error: ErrorType) =>
  new ResultFAIL(error);

export function tryCatch<TargetType, DataType, ErrorType>(
  target: TargetType,
  property: string,
  descriptor: PropertyDescriptor,
): PropertyDescriptor {
  const self = descriptor.value;
  descriptor.value = function (...args: any[]) {
    try {
      if (self instanceof Function) {
        return self.call(this, ...args);
      } else {
        return ResultFail(new TypeError("Descriptor value is not a function."));
      }
    } catch (error) {
      return ResultFail(error);
    }
  };
  return descriptor;
}

export function tryCatchAsync<TargetType, DataType, ErrorType>(
  target: TargetType,
  property: string,
  descriptor: PropertyDescriptor,
): PropertyDescriptor {
  const self = descriptor.value;
  descriptor.value = async function (...args: any[]) {
    try {
      if (self instanceof Function) {
        return await self.call(this, ...args);
      } else {
        return ResultFail(new TypeError("Descriptor value is not a function."));
      }
    } catch (error) {
      return ResultFail(error);
    }
  };
  return descriptor;
}
