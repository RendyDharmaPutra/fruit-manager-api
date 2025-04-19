import { HttpException } from '@nestjs/common';

// Custom Exception
export class CommonException<T> extends HttpException {
  constructor(message: string, errorMessage: T, status: number) {
    super(
      // Mengirim model response
      {
        success: false,
        message: message,
        error: errorMessage,
      },
      status,
    );
  }
}
