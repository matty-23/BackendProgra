import dotenv from 'dotenv';
import { connectDB, disconnectDB } from './Database/conexion.js'; // Ajusta la ruta si lo guardaste en otra carpeta
import { main } from './prueba.js';

// 1. Cargar las variables de entorno ANTES de hacer cualquier otra cosa
dotenv.config();
async function start() {
    await connectDB();
    await main();
    await disconnectDB();
}

start();
// ... Aquí iría el resto de la configuración de tu servidor (por ejemplo, Express) ...