import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class IncomeDetailDto {
  @IsNumber()
  @IsNotEmpty({ message: 'Berat wajib diisi' })
  @Min(1, { message: 'Berat minimal 1 ons' })
  weight: number;

  @IsNumber()
  @IsNotEmpty({ message: 'Harga wajib diisi' })
  @Min(1000, { message: 'Harga minimal Rp1.000' })
  price: number;

  @IsNumber()
  @IsNotEmpty({ message: 'FruitId wajib diisi' })
  fruitId: number;
}
