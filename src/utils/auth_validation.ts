import { HttpStatus, ValidationError, ValidationPipe } from '@nestjs/common';
import { CommonException } from 'src/common/exception/common_exception';

// Custom Validation Pipe
export class CustomValidationPipe extends ValidationPipe {
  // Problem -> Nama Fitur yang sedang dijalankan
  constructor(private problem: string) {
    super({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => this.buildException(errors), // Custom Exception Method overriding Exception Method dari Validation Pipe standard
    });
  }

  // Exception Method
  private buildException(errors: ValidationError[]) {
    // Menangkap semua error validasi
    const formattedErrors = errors.map((error) => ({
      field: error.property,
      messages: Object.values(error.constraints || {}),
    }));

    // Membuat Common Exception dengan error validasi
    return new CommonException(
      `Gagal ${this.problem}`,
      {
        message: 'Data yang diberikan tidak valid',
        validationError: formattedErrors,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
