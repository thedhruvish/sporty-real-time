import type { Response } from "express";

export class ApiResponse<T> {
  constructor(
    public readonly statusCode: number,
    public readonly message: string,
    public readonly success: boolean,
    public readonly data?: T,
  ) {}
}

export class ApiError extends Error {
  statusCode: number;
  errors?: unknown;

  constructor(
    statusCode: number,
    message: string,
    errors?: unknown,
    stack?: string,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
/**
 *
 * @param res Request Object
 * @param statusCode Statuscode
 * @param message Message to send a client
 * @param data Json data
 * @returns void
 */
export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
) => {
  return res
    .status(statusCode)
    .json(
      new ApiResponse<T>(
        statusCode,
        message,
        statusCode >= 200 && statusCode < 300,
        data,
      ),
    );
};
