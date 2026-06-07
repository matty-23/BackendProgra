import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js'
import { connectDB } from './Database/conexion.js';
import dotenv from 'dotenv';
import dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
import { type MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

dotenv.config();

async function bootstrap() {
  try {
    await connectDB();

    const app = await NestFactory.create(AppModule);
    app.enableCors();

    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.GRPC,
      options: {
        package: ['auth', 'carpetas'], 
        // Declaramos las rutas a ambos archivos .proto
        protoPath: [
          join(process.cwd(), 'src/proto/auth.proto'),
          join(process.cwd(), 'src/proto/carpeta.proto')
        ],
        url: '0.0.0.0:50053', 
      },
    });

    await app.startAllMicroservices(); 
    
    const PORT = process.env.PORT || 3000;
    await app.listen(PORT);
    console.log(`Backend is running on port ${PORT}`);

  } catch (error) {

    console.error('Error al iniciar la aplicación:', error);
    process.exit(1);
  }
}
bootstrap();