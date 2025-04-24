import { Module } from '@nestjs/common';
import { FuelController } from './fuel.controller';
import { FuelService } from './fuel.service';
import { Fuel } from './fuel.entity';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Fuel]), AuthModule],
  controllers: [FuelController],
  providers: [FuelService],
})
export class FuelModule {}
