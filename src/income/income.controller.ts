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
import { IncomeService } from './income.service';
import { Income } from './income.entyty';
import { CustomValidationPipe } from 'src/utils/auth_validation';
import { IncomeDto } from './createIncome.dto';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/utils/decorators/roles.decorator';

@UseGuards(RolesGuard)
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

  @Get(':code')
  async getIncome(
    @Param('code') code: string,
  ): Promise<SuccessResponseType<Income>> {
    const income = await this.service.findOne(code);

    return {
      success: true,
      message: 'Berhasil mendapatkan data pemasukan',
      data: income,
    };
  }

  @Post()
  @Roles('CASHIER')
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
  @Roles('MANAGER')
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
