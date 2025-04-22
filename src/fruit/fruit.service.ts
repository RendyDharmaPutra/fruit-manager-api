import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fruit } from './fruit.entity';
import { unhandledError } from 'src/common/exception/unhandled_exception';
import { FruitDto } from './fruit.dto';
import { CommonException } from 'src/common/exception/common_exception';

@Injectable()
export class FruitService {
  constructor(
    @InjectRepository(Fruit)
    private repository: Repository<Fruit>,
  ) {}

  // Fungsi mengambil data buah dari Database
  async findAll() {
    try {
      return this.repository.find(); // Membaca data buah dari Database
    } catch (e) {
      // Error Handling
      throw unhandledError('mendapatkan Pengguna', e);
    }
  }

  // Fungsi menyimpan data buah yang diberikan ke Database
  async saveFruit(fruitDto: FruitDto) {
    try {
      // Memeriksa apakah data Buah yang diberikan sudah ada di Database
      const fruitExist = await this.repository.findOne({
        where: { name: fruitDto.name },
        select: ['id'],
      });

      // Memberikan Error Handling jika data Buah sudah ada di Database
      if (fruitExist)
        throw new CommonException(
          'Gagal menambah data Buah',
          'Data Buah yang diberikan sudah ada',
          HttpStatus.BAD_REQUEST,
        );

      const fruit = this.repository.create(fruitDto); // Membuat instance dari Fruit

      const result = await this.repository.insert(fruit); // Menyimpan instance Fruit yang sudah dibuat ke Database

      // Error Handling jika data buah gagal ditambahkan
      if (result.identifiers.length < 1)
        throw new CommonException(
          'Gagal menambahkan Buah',
          'Terjadi kesalahan',
          HttpStatus.BAD_REQUEST,
        );
    } catch (error) {
      if (error instanceof CommonException) throw error; // Melempar Error yang sudah ditangani

      // Error Handling yang tidak diketahui
      throw unhandledError('menambahkan Buah', error);
    }
  }
}
