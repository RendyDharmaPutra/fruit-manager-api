import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { FruitService } from './fruit.service';
import { FruitDto } from './fruit.dto';
import { CustomValidationPipe } from 'src/utils/auth_validation';
import { Fruit } from './fruit.entity';

@UseGuards(JwtAuthGuard) // Middleware Autentikasi -> Diperlukan token pada beader request
@Controller('fruit')
export class FruitController {
  constructor(private service: FruitService) {}

  // Fungsi mengambil data Buah[]
  @Get() // Get Method "/"
  async getAll(): Promise<SuccessResponseType<Fruit[]>> {
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
    @Body(new CustomValidationPipe('menambah data buah')) //  // ? dinonaktifkan menyesuaikan state diagram
    fruitDto: FruitDto,
  ): Promise<SuccessResponseType<null>> {
    await this.service.saveFruit(fruitDto); // Mengirim data Buah untuk dikerjakan Service

    return {
      success: true,
      message: 'Berhasil menambah data buah',
      data: null,
    };
  }

  // Fungsi mengupdate data Buah
  @Put(':id') // PUT Method "/fruit"
  async updateFruit(
    @Param('id') id: string,
    @Body(new CustomValidationPipe('menambah data buah'))
    fruitDto: FruitDto,
  ): Promise<SuccessResponseType<null>> {
    await this.service.updateFruit(+id, fruitDto);

    return {
      success: true,
      message: 'Berhasil memperbarui data buah',
      data: null,
    };
  }

  // Fungsi menghapus data Buah
  @Delete(':id') // DELETE Method "/fruit/:id"
  async deleteFruit(
    @Param('id') id: string,
  ): Promise<SuccessResponseType<null>> {
    await this.service.deleteFruit(+id);

    return {
      success: true,
      message: 'Berhasil menghapus data buah',
      data: null,
    };
  }
}
