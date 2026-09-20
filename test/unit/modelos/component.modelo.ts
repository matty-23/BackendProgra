
import { Documento } from '../../../src/Models/Documento.js';
import { Componente } from '../../../src/Models/Componente.js';
import { ObjectId } from 'mongodb';
export const modelosComponente = {

    compDocUsuario1: new Componente(
        '507f1f77bcf86cd799439011',
        'Componente',
        new Date(),
        new Date(),
        'usuario-1',
        'documento'
    ),
   ObjtIDCompoDocUSuario1: new ObjectId(
    '507f1f77bcf86cd799439011'
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