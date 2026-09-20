import { DocumentoDto } from '../../../src/DTO/DocumentoDTO.js';
import { Documento } from '../../../src/Models/Documento.js';
import { ObjectId } from 'mongodb';

export const modelosDocumentos = {

    documentoUsuario1: new Documento(
        '507f1f77bcf86cd799439011',
        'documento.pdf',
        new Date(),
        new Date(),
        'usuario-1',
        'Active',
        '1.0'
    ),
    
    documentoUsuariocreadorecien: new Documento(
        '507f1f77bcf86cd799439011',
        'documento.pdf',
        new Date(),
        new Date(),
        'usuario-1',
        'PENDING-UPLOAD',
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

    ObjtIDdocumentoUSuario1: new ObjectId(
        '507f1f77bcf86cd799439011'
    ),
};
export const documentoDto: DocumentoDto = {
    id: '123',
    nombre: 'documento.pdf',
    fechaCreacion: new Date(),
    fechaUltimaModificacion: new Date(),
    idUsuario: 'usuario-1',
    estado: 'activo',
    version: '1.0'
};