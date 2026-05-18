import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js'
import { connectDB } from './Database/conexion.js';
import dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  try {
    await connectDB();

    const app = await NestFactory.create(AppModule);
    app.enableCors();

    const PORT = process.env.PORT || 3000;
    console.log(`🚀 Servidor iniciado en el puerto ${PORT}`);
    await app.listen(PORT);
    console.log('✅ Aplicación NestJS está corriendo...');
  } catch (error) {
    console.error('Error al iniciar la aplicación:', error);
    process.exit(1);
  }
}

bootstrap();