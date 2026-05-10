import mongoose from 'mongoose';
import { ComponenteRepository } from './Database/Context/ComponenteRepository.js';
import { Documento } from './Models/Documento.js';
import { Carpeta } from './Models/Carpeta.js';
import * as readline from "readline/promises";
import { stdin as input, stdout as output } from "process";
import { Componente } from './Models/Componente.js';

const rl = readline.createInterface({ input, output });

export async function main() {

    const nombre = await rl.question("Ingrese su nombre: ");

    console.log(`Hola ${nombre}`);

    rl.close();

    // Documento
    const documento = new Documento(
        1,
        nombre,
        new Date(),
        new Date(),
        1,
        "Contenido del documento",
        "Activo",
        "1.0"
    );

    // Carpeta
    const carpeta = new Carpeta(
        2,
        "Carpeta 1",
        new Date(),
        new Date(),
        1,
        new mongoose.Types.ObjectId(),
        ""
    );

    // Componente para Documento
    const componenteDocumento = new Componente(
        3,
        nombre,
        new Date(),
        new Date(),
        1,
        "Documento"
    );

    // Componente para Carpeta
    const componenteCarpeta = new Componente(
        4,
        "Carpeta 1",
        new Date(),
        new Date(),
        1,
        "Carpeta"
    );

    const repo = new ComponenteRepository();

    // Crear documento + componente asociado
    await repo.crearComponenteDocumento(
        componenteDocumento,
        documento
    );

    // Crear carpeta + componente asociado
    await repo.crearComponenteCarpeta(
        componenteCarpeta,
        carpeta
    );
}
