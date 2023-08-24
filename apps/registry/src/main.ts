/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.REGISTRY_PORT || 80;
  await app.listen(port);

  Logger.log(`Decentrl registry is running 🚀 🚀 🚀 on port ${port}`);
}

bootstrap();
