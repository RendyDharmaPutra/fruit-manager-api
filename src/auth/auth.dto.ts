import { IsNotEmpty } from 'class-validator';

export class AuthDto {
  @IsNotEmpty({ message: 'Username tidak boleh kosong' })
  username: string;

  @IsNotEmpty({ message: 'Password tidak boleh kosong' })
  password: string;
}
