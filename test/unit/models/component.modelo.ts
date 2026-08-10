
import { Documento } from '../../../src/Models/Documento.js';
import { Componente } from '../../../src/Models/Componente.js';

export const modelosComponente = {

    compDocUsuario1: new Componente(
        '123',
        'Componente',
        new Date(),
        new Date(),
        'usuario-1',
        'documento'
    ),
   compDocUsuario1_2: new Componente(
        '124',
        'Componente',
        new Date(),
        new Date(),
        'usuario-1',
        'documento'
    ),
    compDocUsuario2: new Componente(
        '127',
        'Componente',
        new Date(),
        new Date(),
        'usuario-1',
        'documento'
    ),

    compCarpUsuario1: new Componente(
        '110',
        'Componente',
        new Date(),
        new Date(),
        'usuario-1',
        'carpeta'
    ),
}