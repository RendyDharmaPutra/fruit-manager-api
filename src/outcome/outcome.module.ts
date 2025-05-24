import { Module } from '@nestjs/common';
import { OutcomeController } from './outcome.controller';
import { OutcomeService } from './outcome.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Outcome } from './outcome.entyty';
import { OutcomeDetail } from './outcomeDetail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Outcome, OutcomeDetail])],
  controllers: [OutcomeController],
  providers: [OutcomeService],
})
export class OutcomeModule {}
