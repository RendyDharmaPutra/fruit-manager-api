import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Fertilizer } from './fertilizer.entity';
import { unhandledError } from 'src/common/exception/unhandled_exception';
import { FertilizerDto } from './fertilizer.dto';
import { CommonException } from 'src/common/exception/common_exception';

@Injectable()
export class FertilizerService {
  constructor(
    @InjectRepository(Fertilizer)
    private repository: Repository<Fertilizer>,
  ) {}

  // Fungsi mengambil data pupuk dari Database
  async findAll() {
    try {
      return this.repository.find(); // Membaca data pupuk dari Database
    } catch (e) {
      // Error Handling
      throw unhandledError('mendapatkan Pupuk', e);
    }
  }

  // Fungsi menyimpan data pupuk yang diberikan ke Database
  async saveFertilizer(fertilizerDto: FertilizerDto) {
    try {
      // Memeriksa apakah data Pupuk yang diberikan sudah ada di Database
      const fertilizerExist = await this.repository.findOne({
        where: { name: fertilizerDto.name },
        select: ['id'],
      });

      // Memberikan Error Handling jika data Pupuk sudah ada di Database
      if (fertilizerExist)
        throw new CommonException(
          'Gagal menambah data Pupuk',
          'Data Pupuk yang diberikan sudah ada',
          HttpStatus.BAD_REQUEST,
        );

      const fertilizer = this.repository.create(fertilizerDto); // Membuat instance dari Fertilizer

      const result = await this.repository.insert(fertilizer); // Menyimpan instance Fertilizer yang sudah dibuat ke Database

      // Error Handling jika data pupuk gagal ditambahkan
      if (result.identifiers.length < 1)
        throw new CommonException(
          'Gagal menambahkan Pupuk',
          'Terjadi kesalahan',
          HttpStatus.BAD_REQUEST,
        );
    } catch (error) {
      if (error instanceof CommonException) throw error;

      // Error Handling yang tidak diketahui
      throw unhandledError('menambahkan Pupuk', error);
    }
  }

  async updateFertilizer(id: number, fertilizerDto: FertilizerDto) {
    try {
      // Memeriksa apakah data Pupuk yang akan di-update ada di database berdasarkan id
      const existingFertilizer = await this.repository.findOne({
        where: { id },
      });

      if (!existingFertilizer) {
        throw new CommonException(
          'Gagal memperbarui data Pupuk',
          'Data Pupuk tidak ditemukan',
          HttpStatus.NOT_FOUND,
        );
      }

      // Validasi apakah nama pupuk yang baru sudah digunakan oleh pupuk lain
      const duplicateName = await this.repository.findOne({
        where: {
          name: fertilizerDto.name,
          id: Not(id),
        },
      });

      if (duplicateName) {
        throw new CommonException(
          'Gagal memperbarui data Pupuk',
          'Nama Pupuk sudah digunakan',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Melakukan update data Pupuk
      const result = await this.repository.update(id, fertilizerDto);

      if (result.affected === 0) {
        throw new CommonException(
          'Gagal memperbarui Pupuk',
          'Tidak ada data yang diubah',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      if (error instanceof CommonException) throw error;

      throw unhandledError('memperbarui Pupuk', error);
    }
  }

  async deleteFertilizer(id: number) {
    try {
      const existingFertilizer = await this.repository.findOne({
        where: { id },
      });

      if (!existingFertilizer) {
        throw new CommonException(
          'Gagal menghapus data Pupuk',
          'Data Pupuk tidak ditemukan',
          HttpStatus.NOT_FOUND,
        );
      }

      const result = await this.repository.delete(id);

      if (result.affected === 0) {
        throw new CommonException(
          'Gagal menghapus Pupuk',
          'Tidak ada data yang dihapus',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      if (error instanceof CommonException) throw error;

      throw unhandledError('menghapus Pupuk', error);
    }
  }
}
