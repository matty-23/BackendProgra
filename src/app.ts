import dotenv from 'dotenv';
import { connectDB } from './Database/conexion.js'; // Ajusta la ruta si lo guardaste en otra carpeta

// 1. Cargar las variables de entorno ANTES de hacer cualquier otra cosa
dotenv.config();

// 2. Conectar a la base de datos
connectDB();

// ... Aquí iría el resto de la configuración de tu servidor (por ejemplo, Express) ...