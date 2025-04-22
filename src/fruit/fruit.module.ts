import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { FruitController } from './fruit.controller';
import { FruitService } from './fruit.service';
import { AuthModule } from 'src/auth/auth.module';
import { Fruit } from './fruit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Fruit]), AuthModule],
  controllers: [FruitController],
  providers: [FruitService],
})
export class FruitModule {}
