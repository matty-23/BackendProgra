import mongoose from 'mongoose';
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async () => {
    try {
        // process.env.MONGO_URI lee la variable que creaste en el archivo .env
        const conn = await mongoose.connect(process.env.MONGODB_URI as string);
        
        console.log(`✅ MongoDB Conectado exitosamente: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error al conectar a MongoDB: ${(error as Error).message}`);
        process.exit(1); 
    }
};
export function disconnectDB(): Promise<void> {
    return mongoose.disconnect();
}