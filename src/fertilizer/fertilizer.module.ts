import { Module } from '@nestjs/common';
import { FertilizerController } from './fertilizer.controller';
import { FertilizerService } from './fertilizer.service';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fertilizer } from './fertilizer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Fertilizer]), AuthModule],
  controllers: [FertilizerController],
  providers: [FertilizerService],
})
export class FertilizerModule {}
