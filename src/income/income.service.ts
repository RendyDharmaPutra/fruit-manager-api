import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Income } from './income.entyty';
import { Repository } from 'typeorm';
import { unhandledError } from 'src/common/exception/unhandled_exception';
import { IncomeDto } from './createIncome.dto';
import { generateCode } from 'src/utils/generate_code';
import { IncomeDetail } from './incomeDetail.entity';
import { Fruit } from 'src/fruit/fruit.entity';
import { CommonException } from 'src/common/exception/common_exception';

@Injectable()
export class IncomeService {
  constructor(
    @InjectRepository(Income)
    private incomeRepo: Repository<Income>,
    @InjectRepository(IncomeDetail)
    private incomeDetailRepo: Repository<IncomeDetail>,
  ) {}

  async findAll() {
    try {
      return this.incomeRepo.find({
        relations: [],
        select: ['id', 'code', 'distribution', 'totalPrice', 'transactionTime'],
      });
    } catch (e) {
      throw unhandledError('mendapatkan Pemasukan', e);
    }
  }

  async findOne(code: string) {
    try {
      const income = await this.incomeRepo
        .createQueryBuilder('income')
        .leftJoinAndSelect('income.details', 'detail')
        .leftJoinAndSelect('detail.fruit', 'fruit')
        .where('income.code = :code', { code })
        .andWhere('income.deletedAt IS NULL')
        .select([
          'income.code',
          'income.transactionTime',
          'income.totalPrice',
          'income.distribution',
          'detail.weight',
          'detail.price',
          'fruit.name',
          'fruit.price',
        ])
        .getOne();

      if (!income) {
        throw new CommonException(
          'Gagal mandapatkan data Pemasukan',
          'Data Pemasukan tidak ditemukan',
          HttpStatus.NOT_FOUND,
        );
      }

      return income;
    } catch (e) {
      if (e instanceof CommonException) throw e;

      throw unhandledError('mendapatkan Pemasukan', e);
    }
  }

  async saveIncome(incomeDto: IncomeDto, userId: string) {
    const totalPrice = incomeDto.details.reduce(
      (acc, detail) => acc + detail.price,
      0,
    );

    try {
      const countToday = await this.incomeRepo.count({
        where: { transactionTime: incomeDto.transactionTime },
      });

      const code = generateCode(
        'INC',
        incomeDto.transactionTime.toString().replace(/-/g, ''),
        countToday,
      );

      const income = this.createIncomeInstance({
        code,
        distribution: incomeDto.distribution,
        totalPrice,
        transactionTime: incomeDto.transactionTime,
        user: userId,
      });

      const incomeResult = await this.incomeRepo.save(income);

      const incomeDetail = incomeDto.details.map((detail) =>
        this.createIncomeDetailInstance({
          weight: detail.weight,
          price: detail.price,
          fruit: { id: detail.fruitId }, // isi objek Fruit dengan ID
          income: { id: incomeResult.id }, // isi objek Income dengan ID
        }),
      );

      await this.incomeDetailRepo.save(incomeDetail);
    } catch (e) {
      if (e instanceof CommonException) throw e; // Melempar Error yang sudah ditangani

      // Error Handling yang tidak diketahui
      throw unhandledError('menambahkan Pemasukan', e);
    }
  }

  async deleteIncome(code: string) {
    try {
      const income = await this.incomeRepo.findOne({
        where: { code },
        relations: ['details'], // supaya bisa soft-delete detail juga
      });

      if (!income)
        throw new CommonException(
          'Gagal menghapus data Pemasukan',
          'data pemasukan tidak ditemukan',
          HttpStatus.NOT_FOUND,
        );

      // Soft-delete detail terlebih dahulu
      await this.incomeDetailRepo.softRemove(income.details);

      // Lalu soft-delete income-nya
      await this.incomeRepo.softRemove(income);
    } catch (e) {
      if (e instanceof CommonException) throw e; // Melempar Error yang sudah ditangani

      // Error Handling yang tidak diketahui
      throw unhandledError('menghapus Pemasukan', e);
    }
  }

  private createIncomeInstance(incomeData: {
    code: string;
    distribution: boolean;
    totalPrice: number;
    transactionTime: Date;
    deletedAt?: Date;
    user: string;
  }): Income {
    return Object.assign(new Income(), {
      ...incomeData,
    });
  }

  private createIncomeDetailInstance(incomeDetailData: {
    weight: number;
    price: number;
    fruit: Partial<Fruit>;
    income: Partial<Income>;
  }): IncomeDetail {
    return Object.assign(new IncomeDetail(), {
      ...incomeDetailData,
    });
  }
}
