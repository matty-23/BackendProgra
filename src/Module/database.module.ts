// src/database.module.ts
import { Module, Global } from '@nestjs/common';
import { TransactionManager } from '../Database/TransactionManager.js';

@Global() 
@Module({
  providers: [TransactionManager],
  exports: [TransactionManager], // Exportamos para que los servicios puedan inyectarlo
})
export class DatabaseModule {}