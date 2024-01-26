import multipart from '@fastify/multipart';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

const port = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.setGlobalPrefix('api');
  const configService = app.get(ConfigService);
  await app.register(multipart, {
    attachFieldsToBody: true,
    limits: {
      files: configService.get<number>('file.maxFileCount'),
      fileSize: configService.get<number>('file.maxFileSize'),
    },
    throwFileSizeLimit: true,
  });

  await app.listen(configService.get<number>('port'));

  Logger.log(`Server is running on http://localhost:${port}`, 'Bootstrap');
}
bootstrap();
