import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Outcome } from './outcome.entyty';
import { Fruit } from 'src/fruit/fruit.entity';
import { Fertilizer } from 'src/fertilizer/fertilizer.entity';

@Entity()
export class OutcomeDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  count: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @ManyToOne(() => Outcome, (outcome) => outcome.details, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'outcomeId' })
  outcome: Outcome;

  @ManyToOne(() => Fruit, (fruit) => fruit, { eager: true })
  @JoinColumn({ name: 'fruitId' })
  fruit: Fruit;

  @ManyToOne(() => Fertilizer, (fertilizer) => fertilizer, { eager: true })
  @JoinColumn({ name: 'fertilizerId' })
  fertilizer: Fertilizer;
}
