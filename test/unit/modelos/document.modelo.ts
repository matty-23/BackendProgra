import { Documento } from '../../../src/Models/Documento.js';

export const modelosDocumentos = {

    documentoUsuario1: new Documento(
        '123',
        'documento.pdf',
        new Date(),
        new Date(),
        'usuario-1',
        'activo',
        '1.0'
    ),
    documentoUsuario1_2: new Documento(
        '124',
        'documento.pdf',
        new Date(),
        new Date(),
        'usuario-1',
        'activo',
        '1.0'
    ),

    documentoUsuario2: new Documento(
        '127',
        'documento.pdf',
        new Date(),
        new Date(),
        'usuario-2',
        'activo',
        '1.0'
    ),


};