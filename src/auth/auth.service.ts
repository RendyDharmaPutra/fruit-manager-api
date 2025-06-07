import { HttpStatus, Injectable } from '@nestjs/common';
import { CommonException } from 'src/common/exception/common_exception';
import { AuthDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  // Fungsi Login
  // Validasi username auth -> validasi password -> pembuatan token
  async login(authData: AuthDto): Promise<string> {
    const user = await this.userService.findUser(authData.username);

    if (!user)
      // Throw Failed Response
      throw new CommonException(
        'Gagal mengautentikasi Pengguna',
        'Username tidak ditemukan',
        HttpStatus.NOT_FOUND,
      );

    if (!(await compare(authData.password, user.password)))
      // Throw Failed Response
      throw new CommonException(
        'Gagal mengautentikasi Pengguna',
        'Password tidak valid',
        HttpStatus.NOT_FOUND,
      );

    // Buat isi JWT Token
    const payload = {
      sub: user.id,
      role: user.role,
    };

    // Membuat JWT Token
    return this.jwtService.signAsync(payload);
  }
}
