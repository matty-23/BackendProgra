import { AsyncLocalStorage } from 'async_hooks';
import type { ClientSession } from 'mongoose';

export const transactionContext = new AsyncLocalStorage<ClientSession>();