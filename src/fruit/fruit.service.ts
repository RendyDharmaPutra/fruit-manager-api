import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
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
      throw unhandledError('mendapatkan data Buah', e);
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

  async updateFruit(id: number, fruitDto: FruitDto) {
    try {
      // Memeriksa apakah data Buah yang akan di-update ada di database berdasarkan id
      const existingFruit = await this.repository.findOne({
        where: { id },
      });

      // Error Handling jika data Buah tidak ditemukan
      if (!existingFruit) {
        throw new CommonException(
          'Gagal memperbarui data Buah',
          'Data Buah tidak ditemukan',
          HttpStatus.NOT_FOUND,
        );
      }

      // Validasi apakah nama buah yang baru sudah digunakan oleh buah lain
      const duplicateName = await this.repository.findOne({
        where: {
          name: fruitDto.name,
          id: Not(id), // Pastikan tidak mencocokkan dengan dirinya sendiri
        },
      });

      if (duplicateName) {
        throw new CommonException(
          'Gagal memperbarui data Buah',
          'Nama Buah sudah digunakan',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Melakukan update data Buah
      const result = await this.repository.update(id, fruitDto);

      // Validasi hasil update
      if (result.affected === 0) {
        throw new CommonException(
          'Gagal memperbarui Buah',
          'Tidak ada data yang diubah',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      if (error instanceof CommonException) throw error;

      // Error Handling yang tidak diketahui
      throw unhandledError('memperbarui Buah', error);
    }
  }

  async deleteFruit(id: number) {
    try {
      // Cek apakah data dengan id tersebut ada
      const existingFruit = await this.repository.findOne({
        where: { id },
      });

      if (!existingFruit) {
        throw new CommonException(
          'Gagal menghapus data Buah',
          'Data Buah tidak ditemukan',
          HttpStatus.NOT_FOUND,
        );
      }

      // Lakukan penghapusan
      const result = await this.repository.delete(id);

      if (result.affected === 0) {
        throw new CommonException(
          'Gagal menghapus Buah',
          'Tidak ada data yang dihapus',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      if (error instanceof CommonException) throw error;

      throw unhandledError('menghapus Buah', error);
    }
  }
}
