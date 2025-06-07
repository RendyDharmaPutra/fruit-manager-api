import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  UnauthorizedException,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { Response } from 'express';
import { CommonException } from './common_exception';

@Catch(ForbiddenException)
export class ForbiddenExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const customError = new CommonException(
      'Akses tidak diberikan',
      'Anda tidak memiliki Hak Akses di sini.',
      HttpStatus.FORBIDDEN,
    );

    response.status(customError.getStatus()).json(customError.getResponse());
  }
}
