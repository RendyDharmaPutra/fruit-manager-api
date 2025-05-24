import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { OutcomeService } from './outcome.service';
import { Outcome } from './outcome.entyty';
import { CustomValidationPipe } from 'src/utils/auth_validation';
import { OutcomeDto } from './createOutcome.dto';

@UseGuards(JwtAuthGuard)
@Controller('outcome')
export class OutcomeController {
  constructor(private service: OutcomeService) {}

  @Get()
  async getAll(): Promise<SuccessResponseType<Outcome[]>> {
    const outcomes = await this.service.findAll();

    return {
      success: true,
      message: 'Berhasil mendapatkan data pengeluaran',
      data: {
        data: outcomes,
        length: outcomes.length,
      },
    };
  }

  @Get(':code')
  async getOutcome(
    @Param('code') code: string,
  ): Promise<SuccessResponseType<Outcome>> {
    const outcome = await this.service.findOne(code);

    return {
      success: true,
      message: 'Berhasil mendapatkan data pengeluaran',
      data: outcome,
    };
  }

  @Post()
  async addOutcome(
    @Body(new CustomValidationPipe('menambah data pengeluaran'))
    outcomeDto: OutcomeDto,
    @Request() req,
  ) {
    const userId: string = req.user.userId;

    await this.service.saveOutcome(outcomeDto, userId);

    return {
      success: true,
      message: 'Berhasil menambah data pengeluaran',
      data: null,
    };
  }

  @Delete(':code')
  async deleteOutcome(
    @Param('code') code: string,
  ): Promise<SuccessResponseType<null>> {
    await this.service.deleteOutcome(code);

    return {
      success: true,
      message: 'Berhasil menghapus data pengeluaran',
      data: null,
    };
  }
}
