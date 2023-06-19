import { Catch, ArgumentsHost, NotFoundException, ConflictException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class ConflictExceptionFilter extends BaseExceptionFilter {
  catch(exception: ConflictException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(409).json({
      statusCode: 409,
      message: exception.message,
    });
  }
}
