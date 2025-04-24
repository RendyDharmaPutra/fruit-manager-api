import { IsNotEmpty, Length, Max, maxLength, Min } from 'class-validator';

export class FertilizerDto {
  @IsNotEmpty({ message: 'Nama Pupuk tidak boleh kosong' })
  @Length(3, 20, {
    message: 'Nama Pupuk minimal 3 karakter, dan maksimal 20 karakter',
  })
  name: string;

  @Min(1000, { message: 'Harga Pupuk minimal Rp1.000 ' })
  @Max(100000, { message: 'Harga Pupuk maksimal Rp100.000' })
  @IsNotEmpty({ message: 'Harga Pupuk tidak boleh kosong' })
  price: number;
}
