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
import { IncomeService } from './income.service';
import { Income } from './income.entyty';
import { CustomValidationPipe } from 'src/utils/auth_validation';
import { IncomeDto } from './createIncome.dto';

@UseGuards(JwtAuthGuard)
@Controller('income')
export class IncomeController {
  constructor(private service: IncomeService) {}

  @Get()
  async getAll(): Promise<SuccessResponseType<Income[]>> {
    const incomes = await this.service.findAll();

    return {
      success: true,
      message: 'Berhasil mendapatkan data pemasukan',
      data: {
        data: incomes,
        length: incomes.length,
      },
    };
  }

  @Post()
  async addIncome(
    @Body(new CustomValidationPipe('menambah data pemasukan'))
    incomeDto: IncomeDto,
    @Request() req,
  ) {
    const userId: string = await req.user.userId;

    await this.service.saveIncome(incomeDto, userId);

    return {
      success: true,
      message: 'Berhasil menambah data pemasukan',
      data: null,
    };
  }

  @Delete(':code')
  async deleteIncome(
    @Param('code') code: string,
  ): Promise<SuccessResponseType<null>> {
    await this.service.deleteIncome(code);

    return {
      success: true,
      message: 'Berhasil menghapus data pemasukan',
      data: null,
    };
  }
}
