import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UnauthorizedExceptionFilter } from './common/exception/unauthorized_exception';
import { ForbiddenExceptionFilter } from './common/exception/forbidden_exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new UnauthorizedExceptionFilter());
  app.useGlobalFilters(new ForbiddenExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
