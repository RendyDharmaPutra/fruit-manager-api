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
import { FuelService } from './fuel.service';
import { CustomValidationPipe } from 'src/utils/auth_validation';
import { FuelDto } from './fuel.dto';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/utils/decorators/roles.decorator';

@Controller('fuel')
@UseGuards(RolesGuard) // Middleware Autentikasi -> Diperlukan token pada beader request
export class FuelController {
  constructor(private service: FuelService) {}

  // Fungsi mengambil data bensin[]
  @Get() // Get Method "/"
  @Roles('MANAGER')
  async getAll(): Promise<SuccessResponseType<any[]>> {
    const fuels = await this.service.findAll(); // Memanggil Service untuk membaca seluruh data bensin

    return {
      success: true,
      message: 'Berhasil mendapatkan data bensin',
      data: {
        data: fuels,
        length: fuels.length,
      },
    };
  }

  // Fungsi menambah data bensin
  @Post() // Post Method "/"
  @Roles('MANAGER')
  async addFuel(
    @Body(new CustomValidationPipe('menambah data bensin')) // new CustomValidationPipe('menambah data bensin') // ? dinonaktifkan menyesuaikan state diagram
    fuelDto: FuelDto,
  ): Promise<SuccessResponseType<null>> {
    await this.service.saveFuel(fuelDto); // Mengirim data bensin untuk dikerjakan Service

    return {
      success: true,
      message: 'Berhasil menambah data bensin',
      data: null,
    };
  }

  // Fungsi mengupdate data bensin
  @Put(':id') // PUT Method "/fuel"
  @Roles('MANAGER')
  async updateFuel(
    @Param('id') id: string,
    @Body(new CustomValidationPipe('mengubah data bensin'))
    fuelDto: FuelDto,
  ): Promise<SuccessResponseType<null>> {
    await this.service.updateFuel(+id, fuelDto);

    return {
      success: true,
      message: 'Berhasil memperbarui data bensin',
      data: null,
    };
  }

  // Fungsi menghapus data bensin
  @Delete(':id') // DELETE Method "/fuel/:id"
  @Roles('MANAGER')
  async deleteFuel(
    @Param('id') id: string,
  ): Promise<SuccessResponseType<null>> {
    await this.service.deleteFuel(+id);

    return {
      success: true,
      message: 'Berhasil menghapus data bensin',
      data: null,
    };
  }
}
