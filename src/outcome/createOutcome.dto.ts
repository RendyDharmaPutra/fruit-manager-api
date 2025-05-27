import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OutcomeDetailDto } from './createOutcomeDetail.dto';

export class OutcomeDto {
  @IsDateString()
  @IsNotEmpty({ message: 'Tanggal transaksi tidak boleh kosong' })
  transactionTime: Date;

  @IsArray({ message: 'Detail transaksi harus berupa array' })
  @ValidateNested({ each: true })
  @Type(() => OutcomeDetailDto)
  @ArrayMinSize(1, { message: 'Harus terdapat pupuk yang dipilih' })
  details: OutcomeDetailDto[];
}
