import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { FruitService } from './fruit.service';
import { FruitDto } from './fruit.dto';
import { CustomValidationPipe } from 'src/utils/auth_validation';

@UseGuards(JwtAuthGuard) // Middleware Autentikasi -> Diperlukan token pada beader request
@Controller('fruit')
export class FruitController {
  constructor(private service: FruitService) {}

  // Fungsi mengambil data Buah[]
  @Get() // Get Method "/"
  async getAll(): Promise<SuccessResponseType<any[]>> {
    const fruits = await this.service.findAll(); // Memanggil Service untuk membaca seluruh data Buah

    return {
      success: true,
      message: 'Berhasil mendapatkan data buah',
      data: {
        data: fruits,
        length: fruits.length,
      },
    };
  }

  // Fungsi menambah data Buah
  @Post() // Post Method "/"
  async addFruit(
    @Body(new CustomValidationPipe('menambah data buah')) fruitDto: FruitDto,
  ): Promise<SuccessResponseType<null>> {
    await this.service.saveFruit(fruitDto); // Mengirim data Buah untuk dikerjakan Service

    return {
      success: true,
      message: 'Berhasil menambah data buah',
      data: null,
    };
  }
}
