import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {IoAdapter} from '@nestjs/platform-socket.io'
import { ServerOptions } from 'socket.io';

class CorsIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: ServerOptions) {
    return super.createIOServer(port, {
      ...options,
      cors: { origin: process.env.FRONTEND_URL, credentials: true }
    });
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new CorsIoAdapter(app));
  app.enableCors({ origin: process.env.FRONTEND_URL});
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
