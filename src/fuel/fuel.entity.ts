import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// tabel Bensin
@Entity()
export class Fuel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;
}
