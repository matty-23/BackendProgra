import { Module } from '@nestjs/common';
import { TransactionManager } from '../Database/TransactionManager.js';

@Module({
  providers: [TransactionManager],
  exports: [TransactionManager],
})
export class DatabaseModule {}