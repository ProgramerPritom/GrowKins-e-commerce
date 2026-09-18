export class ApiError extends Error {
  public statusCode: number;
  public errors?: Record<string, string[]>;

  constructor(message: string, statusCode: number = 500, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, errors: Record<string, string[]>) {
    super(message, 422, errors);
    this.name = 'ValidationError';
  }
}
