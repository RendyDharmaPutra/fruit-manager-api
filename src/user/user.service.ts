import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { unhandledError } from 'src/common/exception/unhandled_exception';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  // Fungi mengambil User berdasarkan Username
  async findUser(username: string) {
    try {
      // Akses Database
      return this.repository.findOne({
        where: { username },
      });
    } catch (e) {
      // Error Handling
      throw unhandledError('mendapatkan Pengguna', e);
    }
  }

  addUser() {
    console.log('Tambah User');
  }
}
