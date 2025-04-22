import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// tabel Buah
@Entity()
export class Fruit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;
}
