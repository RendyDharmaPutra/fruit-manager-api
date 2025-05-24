import { User } from 'src/user/user.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OutcomeDetail } from './outcomeDetail.entity';

@Entity()
export class Outcome {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ type: 'date' })
  transactionTime: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => User, (user) => user)
  @JoinColumn()
  user: User;

  @OneToMany(() => OutcomeDetail, (detail) => detail.outcome, { cascade: true })
  details: OutcomeDetail[];
}
