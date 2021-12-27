import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const error = exception.getResponse() as
      | { message: any; statusCode: number }
      | { error: string; statusCode: 400; message: string[] }; // class-validator
    if (
      typeof error !== 'string' &&
      status === 401 &&
      error.message === 'jwt expired'
    ) {
      return response.status(status).json({
        success: false,
        data: null,
        error: {
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          message: error.message,
          accessTokenExpired: true,
        },
      });
    }

    response.status(status).json({
      success: false,
      data: null,
      error: {
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: error.message,
      },
    });
  }
}
