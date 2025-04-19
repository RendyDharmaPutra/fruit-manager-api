import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './auth.dto';
import { AuthValidationPipe } from './utils/auth_validation';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  // Fungsi Login
  @Post() // Post Method, body request -> username & password
  async login(
    @Body(new AuthValidationPipe('mengautentikasi Pengguna')) authDto: AuthDto,
  ) {
    // Dikerjakan oleh Service
    const token = await this.service.login(authDto);

    return {
      success: true,
      message: 'Berhasil mengautentikasi Pengguna',
      data: {
        token: token,
      },
    };
  }
}
