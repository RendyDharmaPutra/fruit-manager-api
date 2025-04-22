import { IsNotEmpty, Length, Max, maxLength, Min } from 'class-validator';

export class FruitDto {
  @IsNotEmpty({ message: 'Nama Buah tidak boleh kosong' })
  @Length(3, 20, {
    message: 'Nama Buah minimal 3 karakter, dan maksimal 20 karakter',
  })
  name: string;

  @Min(1000, { message: 'Harga Buah minimal Rp1.000 ' })
  @Max(100000, { message: 'Harga Buah maksimal Rp100.000' })
  @IsNotEmpty({ message: 'Harga Buah tidak boleh kosong' })
  price: number;
}
