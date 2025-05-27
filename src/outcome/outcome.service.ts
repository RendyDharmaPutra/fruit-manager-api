import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Outcome } from './outcome.entyty';
import { Repository } from 'typeorm';
import { unhandledError } from 'src/common/exception/unhandled_exception';
import { OutcomeDto } from './createOutcome.dto';
import { generateCode } from 'src/utils/generate_code';
import { OutcomeDetail } from './outcomeDetail.entity';
import { Fruit } from 'src/fruit/fruit.entity';
import { Fertilizer } from 'src/fertilizer/fertilizer.entity';
import { CommonException } from 'src/common/exception/common_exception';

@Injectable()
export class OutcomeService {
  constructor(
    @InjectRepository(Outcome)
    private outcomeRepo: Repository<Outcome>,
    @InjectRepository(OutcomeDetail)
    private outcomeDetailRepo: Repository<OutcomeDetail>,
  ) {}

  async findAll() {
    try {
      return this.outcomeRepo.find({
        relations: [],
        select: ['id', 'code', 'totalPrice', 'transactionTime'],
      });
    } catch (e) {
      throw unhandledError('mendapatkan Pengeluaran', e);
    }
  }

  async findOne(code: string) {
    try {
      const outcome = await this.outcomeRepo
        .createQueryBuilder('outcome')
        .leftJoinAndSelect('outcome.details', 'detail')
        .leftJoinAndSelect('detail.fruit', 'fruit')
        .leftJoinAndSelect('detail.fertilizer', 'fertilizer')
        .where('outcome.code = :code', { code })
        .andWhere('outcome.deletedAt IS NULL')
        .select([
          'outcome.code',
          'outcome.transactionTime',
          'outcome.totalPrice',
          'detail.count',
          'detail.price',
          'fruit.name',
          'fertilizer.name',
        ])
        .getOne();

      if (!outcome) {
        throw new CommonException(
          'Gagal mendapatkan data Pengeluaran',
          'Data Pengeluaran tidak ditemukan',
          HttpStatus.NOT_FOUND,
        );
      }

      return outcome;
    } catch (e) {
      if (e instanceof CommonException) throw e;
      throw unhandledError('mendapatkan Pengeluaran', e);
    }
  }

  async saveOutcome(outcomeDto: OutcomeDto, userId: string) {
    const totalPrice = outcomeDto.details.reduce(
      (acc, detail) => acc + detail.price,
      0,
    );

    try {
      const countToday = await this.outcomeRepo
        .createQueryBuilder('outcome')
        .withDeleted()
        .where('outcome.transactionTime = :transactionTime', {
          transactionTime: outcomeDto.transactionTime,
        })
        .getCount();

      const code = generateCode(
        'OUT',
        outcomeDto.transactionTime.toString().replace(/-/g, ''),
        countToday,
      );

      const outcome = this.createOutcomeInstance({
        code,
        totalPrice,
        transactionTime: outcomeDto.transactionTime,
        user: userId,
      });

      const outcomeResult = await this.outcomeRepo.save(outcome);

      const outcomeDetails = outcomeDto.details.map((detail) =>
        this.createOutcomeDetailInstance({
          count: detail.count,
          price: detail.price,
          fruit: { id: detail.fruitId },
          fertilizer: { id: detail.fertilizerId },
          outcome: { id: outcomeResult.id },
        }),
      );

      await this.outcomeDetailRepo.save(outcomeDetails);
    } catch (e) {
      if (e instanceof CommonException) throw e;
      throw unhandledError('menambahkan Pengeluaran', e);
    }
  }

  async deleteOutcome(code: string) {
    try {
      const outcome = await this.outcomeRepo.findOne({
        where: { code },
        relations: ['details'],
      });

      if (!outcome)
        throw new CommonException(
          'Gagal menghapus data Pengeluaran',
          'Data pengeluaran tidak ditemukan',
          HttpStatus.NOT_FOUND,
        );

      await this.outcomeDetailRepo.softRemove(outcome.details);
      await this.outcomeRepo.softRemove(outcome);
    } catch (e) {
      if (e instanceof CommonException) throw e;
      throw unhandledError('menghapus Pengeluaran', e);
    }
  }

  private createOutcomeInstance(outcomeData: {
    code: string;
    totalPrice: number;
    transactionTime: Date;
    deletedAt?: Date;
    user: string;
  }): Outcome {
    return Object.assign(new Outcome(), {
      ...outcomeData,
    });
  }

  private createOutcomeDetailInstance(outcomeDetailData: {
    count: number;
    price: number;
    fruit: Partial<Fruit>;
    fertilizer: Partial<Fertilizer>;
    outcome: Partial<Outcome>;
  }): OutcomeDetail {
    return Object.assign(new OutcomeDetail(), {
      ...outcomeDetailData,
    });
  }
}
