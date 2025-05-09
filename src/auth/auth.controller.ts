import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './auth.dto';
import { CustomValidationPipe } from '../utils/auth_validation';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  // Fungsi Login
  @Post() // Post Method, body request -> username & password
  async login(
    @Body(new CustomValidationPipe('mengautentikasi Pengguna'))
    authDto: AuthDto,
  ) {
    // Dikerjakan oleh Service
    const token = await this.service.login(authDto);

    return {
      success: true,
      message: 'Berhasil mengautentikasi Pengguna',
      data: {
        token,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  async logout() {
    return {
      success: true,
      message: 'Berhasil melakukan logout',
      data: null,
    };
  }
}
