import { DocumentoModel } from '../Schemes/DocumentoScheme.js';
import { Documento } from '../../Models/Documento.js';
import type { IDocumentoScheme } from '../../Interfaces/IDocumentoScheme.js';
import mongoose from 'mongoose';

export class DocumentoRepository {

   
    private convertirADominio(doc: IDocumentoScheme): Documento {
        return new Documento(
            doc.id,
            doc.nombre,
            doc.fechaCreacion,
            doc.fechaUltimaModificacion,
            doc.idUsuario,
            doc.contenido,
            doc.estado,
            doc.version
        );
    }

    
    async crear(documento: Documento): Promise<mongoose.Types.ObjectId> {
        const nuevoDoc = new DocumentoModel({
            id: documento.getId(),
            nombre: documento['nombre'], 
            fechaCreacion: documento['fechaCreacion'],
            fechaUltimaModificacion: documento['fechaUltimaModificacion'],
            idUsuario: documento['idUsuario'],
            tipo: documento.getTipo(),
            contenido: documento.getContenido(),
            estado: documento.getEstado(),
            version: documento.getVersion() 
        });

        const docGuardado = await nuevoDoc.save();
        return docGuardado._id;
    }

    
    async obtenerPorId(id: number): Promise<Documento | null> {
        const doc = await DocumentoModel.findOne({ id }).exec();
        if (!doc) return null;
        return this.convertirADominio(doc);
    }

    
    async obtenerTodos(): Promise<Documento[]> {
        const docs = await DocumentoModel.find().exec();
        return docs.map(doc => this.convertirADominio(doc));
    }

    
    async actualizar(id: number, datosActualizados: Partial<IDocumentoScheme>): Promise<Documento | null> {
        datosActualizados.fechaUltimaModificacion = new Date();

        const docActualizado = await DocumentoModel.findOneAndUpdate({ id }, datosActualizados, { new: true }).exec();

        if (!docActualizado) return null;
        return this.convertirADominio(docActualizado);
    }

    
    async eliminar(id: number): Promise<boolean> {
        const resultado = await DocumentoModel.deleteOne({ id }).exec();
        return resultado.deletedCount === 1;
    }
}