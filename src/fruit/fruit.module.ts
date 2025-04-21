import { Module } from '@nestjs/common';
import { FruitController } from './fruit.controller';
import { FruitService } from './fruit.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [FruitController],
  providers: [FruitService],
})
export class FruitModule {}
