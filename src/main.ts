import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { connectDB } from './Database/conexion.js';
import dotenv from 'dotenv';
import dns from 'node:dns';
import { type MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

dns.setServers(['8.8.8.8', '8.8.4.4']);
dotenv.config();

async function bootstrap() {
  try {
    await connectDB();

    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      AppModule,
      {
        transport: Transport.GRPC,
        options: {
          package: ['auth', 'carpetas', 'documentos', 'usuario'],
          protoPath: [
            join(process.cwd(), 'src/proto/auth.proto'),
            join(process.cwd(), 'src/proto/carpeta.proto'),
            join(process.cwd(), 'src/proto/documento.proto'),
            join(process.cwd(), 'src/proto/user.proto'),
          ],
          url: '0.0.0.0:50053',
        },
      },
    );

    await app.listen();

    console.log('gRPC server running on port 50053');
  } catch (error) {
    console.error('Error al iniciar la aplicación:', error);
    process.exit(1);
  }
}

bootstrap();