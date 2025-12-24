import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './interceptor/response.interceptor';

async function bootstrap() {
  Logger.log('**BOOTSTRAP START**');
  const app = await NestFactory.create(AppModule);
  Logger.log('**AFTER CREATE APP MODULE**');

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(process.env.APP_PORT ?? 3000, '0.0.0.0');
  Logger.log('**AFTER LISTEN PORT**');
}
bootstrap();
