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
import { FertilizerService } from './fertilizer.service';
import { CustomValidationPipe } from 'src/utils/auth_validation';
import { FertilizerDto } from './fertilizer.dto';

@UseGuards(JwtAuthGuard) // Middleware Autentikasi -> Diperlukan token pada header request
@Controller('fertilizer')
export class FertilizerController {
  constructor(private service: FertilizerService) {}

  // Fungsi mengambil data pupuk[]
  @Get() // Get Method "/"
  async getAll(): Promise<SuccessResponseType<any[]>> {
    const fertilizers = await this.service.findAll(); // Memanggil Service untuk membaca seluruh data pupuk

    return {
      success: true,
      message: 'Berhasil mendapatkan data pupuk',
      data: {
        data: fertilizers,
        length: fertilizers.length,
      },
    };
  }

  // Fungsi menambah data pupuk
  @Post() // Post Method "/"
  async addFertilizer(
    @Body(new CustomValidationPipe('menambah data pupuk')) // new CustomValidationPipe('menambah data pupuk') // ? dinonaktifkan menyesuaikan state diagram
    fertilizerDto: FertilizerDto,
  ): Promise<SuccessResponseType<null>> {
    await this.service.saveFertilizer(fertilizerDto); // Mengirim data pupuk untuk dikerjakan Service

    return {
      success: true,
      message: 'Berhasil menambah data pupuk',
      data: null,
    };
  }

  // Fungsi mengupdate data pupuk
  @Put(':id') // PUT Method "/fertilizer/:id"
  async updateFertilizer(
    @Param('id') id: string,
    @Body(new CustomValidationPipe('mengubah data pupuk'))
    fertilizerDto: FertilizerDto,
  ): Promise<SuccessResponseType<null>> {
    await this.service.updateFertilizer(+id, fertilizerDto);

    return {
      success: true,
      message: 'Berhasil memperbarui data pupuk',
      data: null,
    };
  }

  // Fungsi menghapus data pupuk
  @Delete(':id') // DELETE Method "/fertilizer/:id"
  async deleteFertilizer(
    @Param('id') id: string,
  ): Promise<SuccessResponseType<null>> {
    await this.service.deleteFertilizer(+id);

    return {
      success: true,
      message: 'Berhasil menghapus data pupuk',
      data: null,
    };
  }
}
