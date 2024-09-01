import { Catch, ArgumentsHost, HttpException, HttpStatus, ExceptionFilter } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { MyLoggerService } from './my-logger/my-logger.service'; // Ensure the correct path
import { PrismaClientValidationError } from '@prisma/client/runtime/library';

type MyResponseObj = {
  statusCode: number;
  timestamp: string;
  path: string;
  response: string | object;
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: MyLoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const myResponseObj: MyResponseObj = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
      path: request.url,
      response: 'Internal Server Error',
    };

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      
    
      if (exception.getStatus() === HttpStatus.UNAUTHORIZED) {
        myResponseObj.statusCode = HttpStatus.UNAUTHORIZED;
        myResponseObj.response = 'Unauthorized. Please log in.';
      } else {
        myResponseObj.statusCode = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;
        myResponseObj.response = exceptionResponse;
      }
    } else if (exception instanceof PrismaClientValidationError) {
      myResponseObj.statusCode = HttpStatus.UNPROCESSABLE_ENTITY; // 422
      myResponseObj.response = exception.message.replace(/\n/g, ' ');
    } else if (exception instanceof Error) {
      myResponseObj.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      myResponseObj.response = exception.message;
    }
    if (!HttpStatus[myResponseObj.statusCode]) {
      myResponseObj.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      myResponseObj.response = 'Invalid status code';
    }

   
    response.status(myResponseObj.statusCode).json(myResponseObj);

    this.logger.error(
      `Error occurred: ${myResponseObj.response} - ${exception instanceof Error ? exception.stack : ''}`,
      AllExceptionsFilter.name
    );
  }
}
