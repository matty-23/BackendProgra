import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { transactionContext } from './TransactionContext.js';

@Injectable()
export class TransactionManager {
    
    async execute<T>(operacion: () => Promise<T>): Promise<T> {
        
        if (transactionContext.getStore()) {
            return await operacion();
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const result = await transactionContext.run(session, async () => {
                return await operacion();
            });

            await session.commitTransaction();
            return result;

        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            await session.endSession();
        }
    }
}