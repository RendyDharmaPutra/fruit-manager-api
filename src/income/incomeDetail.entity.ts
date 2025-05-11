import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Income } from './income.entyty';
import { Fruit } from 'src/fruit/fruit.entity';

@Entity()
export class IncomeDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  weight: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @ManyToOne(() => Income, (income) => income.details, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'incomeId' })
  income: Income;

  @ManyToOne(() => Fruit, (fruit) => fruit, { eager: true })
  @JoinColumn({ name: 'fruitId' })
  fruit: Fruit;
}
