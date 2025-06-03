import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNotEmpty,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IncomeDetailDto } from './createIncomeDetail.dto';

export class IncomeDto {
  @IsDateString()
  @IsNotEmpty({ message: 'Tanggal transaksi tidak boleh kosong' })
  transactionTime: Date;

  @IsNotEmpty({ message: 'Jenis distribusi tidak boleh kosong' })
  distribution: boolean;

  @IsNotEmpty({ message: 'Total Harga tidak boleh kosong' })
  @Min(1000, { message: 'Total Harga minimal Rp1000' })
  totalPrice: number;

  @IsArray({ message: 'Detail transaksi harus berupa array' })
  @ValidateNested({ each: true })
  @Type(() => IncomeDetailDto)
  @ArrayMinSize(1, { message: 'Harus terdapat buah yang dipilih' })
  details: IncomeDetailDto[];
}
