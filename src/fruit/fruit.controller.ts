import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('fruit')
export class FruitController {
  @UseGuards(JwtAuthGuard)
  @Get()
  getAll() {
    return 'Hello World';
  }
}
