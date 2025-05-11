import {
  IsArray,
  IsDateString,
  IsNotEmpty,
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

  @IsArray({ message: 'Detail transaksi harus berupa array' })
  @ValidateNested({ each: true })
  @Type(() => IncomeDetailDto)
  details: IncomeDetailDto[];
}
