import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

// Tabel User
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid') // Auto Generate UUID ketika menambahkan data pengguna
  id: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  role: string;
}
