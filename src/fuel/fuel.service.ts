import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { unhandledError } from 'src/common/exception/unhandled_exception';
import { CommonException } from 'src/common/exception/common_exception';
import { FuelDto } from './fuel.dto';
import { Fuel } from './fuel.entity';

@Injectable()
export class FuelService {
  constructor(
    @InjectRepository(Fuel)
    private repository: Repository<Fuel>,
  ) {}

  // Fungsi mengambil data Bensin dari Database
  async findAll() {
    try {
      return this.repository.find(); // Membaca data Bensin dari Database
    } catch (e) {
      // Error Handling
      throw unhandledError('mendapatkan Pengguna', e);
    }
  }

  // Fungsi menyimpan data Bensin yang diberikan ke Database
  async saveFuel(fuelDto: FuelDto) {
    try {
      // Memeriksa apakah data Bensin yang diberikan sudah ada di Database
      const fuelExist = await this.repository.findOne({
        where: { name: fuelDto.name },
        select: ['id'],
      });

      // Memberikan Error Handling jika data Bensin sudah ada di Database
      if (fuelExist)
        throw new CommonException(
          'Gagal menambah data Bensin',
          'Data Bensin yang diberikan sudah ada',
          HttpStatus.BAD_REQUEST,
        );

      const fuel = this.repository.create(fuelDto); // Membuat instance dari fuel

      const result = await this.repository.insert(fuel); // Menyimpan instance fuel yang sudah dibuat ke Database

      // Error Handling jika data Bensin gagal ditambahkan
      if (result.identifiers.length < 1)
        throw new CommonException(
          'Gagal menambahkan Bensin',
          'Terjadi kesalahan',
          HttpStatus.BAD_REQUEST,
        );
    } catch (error) {
      if (error instanceof CommonException) throw error; // Melempar Error yang sudah ditangani

      // Error Handling yang tidak diketahui
      throw unhandledError('menambahkan Bensin', error);
    }
  }

  async updateFuel(id: number, fuelDto: FuelDto) {
    try {
      // Memeriksa apakah data Bensin yang akan di-update ada di database berdasarkan id
      const existingFuel = await this.repository.findOne({
        where: { id },
      });

      // Error Handling jika data Bensin tidak ditemukan
      if (!existingFuel) {
        throw new CommonException(
          'Gagal memperbarui data Bensin',
          'Data Bensin tidak ditemukan',
          HttpStatus.NOT_FOUND,
        );
      }

      // Validasi apakah nama Bensin yang baru sudah digunakan oleh Bensin lain
      const duplicateName = await this.repository.findOne({
        where: {
          name: fuelDto.name,
          id: Not(id), // Pastikan tidak mencocokkan dengan dirinya sendiri
        },
      });

      if (duplicateName) {
        throw new CommonException(
          'Gagal memperbarui data Bensin',
          'Nama Bensin sudah digunakan',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Melakukan update data Bensin
      const result = await this.repository.update(id, fuelDto);

      // Validasi hasil update
      if (result.affected === 0) {
        throw new CommonException(
          'Gagal memperbarui Bensin',
          'Tidak ada data yang diubah',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      if (error instanceof CommonException) throw error;

      // Error Handling yang tidak diketahui
      throw unhandledError('memperbarui Bensin', error);
    }
  }

  async deleteFuel(id: number) {
    try {
      // Cek apakah data dengan id tersebut ada
      const existingFuel = await this.repository.findOne({
        where: { id },
      });

      if (!existingFuel) {
        throw new CommonException(
          'Gagal menghapus data Bensin',
          'Data Bensin tidak ditemukan',
          HttpStatus.NOT_FOUND,
        );
      }

      // Lakukan penghapusan
      const result = await this.repository.delete(id);

      if (result.affected === 0) {
        throw new CommonException(
          'Gagal menghapus Bensin',
          'Tidak ada data yang dihapus',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      if (error instanceof CommonException) throw error;

      throw unhandledError('menghapus Bensin', error);
    }
  }
}
