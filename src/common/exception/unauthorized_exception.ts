import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  UnauthorizedException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { CommonException } from './common_exception';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const customError = new CommonException(
      'Request tidak diterima',
      'Tidak terautentikasi',
      HttpStatus.UNAUTHORIZED,
    );

    response.status(customError.getStatus()).json(customError.getResponse());
  }
}
