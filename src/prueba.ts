import mongoose from 'mongoose';
import { ComponenteRepository } from './Database/Context/ComponenteRepository.js';

import { Carpeta } from './Models/Carpeta.js';
import * as readline from "readline/promises";
import { stdin as input, stdout as output } from "process";
import { Componente } from './Models/Componente.js';
import { CarpetaRepository } from './Database/Context/CarpetaRepository.js';

const rl = readline.createInterface({ input, output });

export async function main() {

    const nombre = await rl.question("Ingrese su nombre: ");

    console.log(`Hola ${nombre}`);

    rl.close();
    const carpetaRepositorio = new CarpetaRepository();

    const carpeta = await carpetaRepositorio.obtenerPorId(new mongoose.Types.ObjectId("6a00a1d4173b40bf4d714a04"));
    if (carpeta) {
        await carpetaRepositorio.eliminar(carpeta._id);
    }
    else {
        console.log("No se encontró la carpeta con el ID proporcionado.");
    }

}
