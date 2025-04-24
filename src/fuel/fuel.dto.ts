import { IsNotEmpty, Length, Max, maxLength, Min } from 'class-validator';

export class FuelDto {
  @IsNotEmpty({ message: 'Nama Bensin tidak boleh kosong' })
  @Length(3, 20, {
    message: 'Nama Bensin minimal 3 karakter, dan maksimal 20 karakter',
  })
  name: string;

  @Min(1000, { message: 'Harga Bensin minimal Rp1.000 ' })
  @Max(100000, { message: 'Harga Bensin maksimal Rp100.000' })
  @IsNotEmpty({ message: 'Harga Bensin tidak boleh kosong' })
  price: number;
}
