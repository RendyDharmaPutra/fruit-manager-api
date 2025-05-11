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
import { IncomeDetail } from './incomeDetail.entity';

@Entity()
export class Income {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  distribution: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ type: 'date' })
  transactionTime: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => User, (user) => user)
  @JoinColumn()
  user: User;

  @OneToMany(() => IncomeDetail, (detail) => detail.income, { cascade: true })
  details: IncomeDetail[];
}
