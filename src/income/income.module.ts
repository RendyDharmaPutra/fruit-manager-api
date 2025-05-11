import { Module } from '@nestjs/common';
import { IncomeController } from './income.controller';
import { IncomeService } from './income.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Income } from './income.entyty';
import { IncomeDetail } from './incomeDetail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Income, IncomeDetail])],
  controllers: [IncomeController],
  providers: [IncomeService],
})
export class IncomeModule {}
