import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class OutcomeDetailDto {
  @IsNumber()
  @IsNotEmpty({ message: 'Jumlah wajib diisi' })
  @Min(1, { message: 'Jumlah minimal 1' })
  count: number;

  @IsNumber()
  @IsNotEmpty({ message: 'Harga wajib diisi' })
  @Min(1000, { message: 'Harga minimal Rp1.000' })
  price: number;

  @IsNumber()
  @IsNotEmpty({ message: 'FruitId wajib diisi' })
  fruitId: number;

  @IsNumber()
  @IsNotEmpty({ message: 'FertilizerId wajib diisi' })
  fertilizerId: number;
}
