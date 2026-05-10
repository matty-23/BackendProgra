import 'dotenv/config';
import { poolPromise, connectDB } from './Database/conexion.js'; // Ajusta la ruta a tu archivo

async function test() {
  console.log('🔍 Iniciando prueba de conexiones...\n');


  console.log('-------------------------------------------');

  // --- PRUEBA SQL SERVER ---
  try {
    const pool = await poolPromise;
    if (pool && pool.connected) {
      console.log('✅ SQL Server: Conexión establecida correctamente.');
      
      // Consulta rápida para verificar que responde
      const result = await pool.request().query('SELECT GETDATE() as fecha');
      console.log('⏱️  Hora del servidor SQL:', result.recordset[0].fecha);
    } else {
      throw new Error('Pool no disponible');
    }
  } catch (err) {
    console.error('❌ SQL Server: Error de conexión.');
  }

  console.log('\n🏁 Prueba finalizada. Presiona Ctrl+C para salir si el proceso no termina.');
}

test();