import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// tabel Bensin
@Entity()
export class Fertilizer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;
}
