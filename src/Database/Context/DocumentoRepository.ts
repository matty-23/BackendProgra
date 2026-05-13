import { DocumentoModel } from '../Schemes/DocumentoScheme.js';
import { Documento } from '../../Models/Documento.js';
import mongoose, { Types, type ObjectId } from 'mongoose';
import type { IDocumentoScheme } from '../../Interfaces/IDocumentoScheme.js';
import { ComponenteModel } from '../Schemes/ComponenteScheme.js';
import { ComponenteRepository } from './ComponenteRepository.js';
import { Componente } from '../../Models/Componente.js';

const componenteR = new ComponenteRepository();

export class DocumentoRepository {
    
    async crear(id: Types.ObjectId, estado: string, version: string): Promise<mongoose.Types.ObjectId> {
        const nuevoDoc = new DocumentoModel({
            _id: id,
            estado: estado,
            version: version
        });
        
        const docGuardado = await nuevoDoc.save();
        return docGuardado._id;
    }


    async obtenerPorId(id: Types.ObjectId, componente: Componente): Promise<Documento | null> {
        const doc = await DocumentoModel.findById(id).lean<IDocumentoScheme>().exec();
        if (!doc) return null;
        return new Documento(componente.getId(), componente.getNombre(), componente.getFechaCreacion(), componente.getFechaUltimaModificacion(), componente.getIdUsuario(), doc.estado, doc.version)
    }


    async obtenerTodos(): Promise<Documento[]> {
        const docs = await DocumentoModel.find().lean<IDocumentoScheme>().exec();
        const newDocs = [];
        for (const doc in docs) {
            const componente = componenteR.obtenerPorId(doc._id);
            if (!componente) continue;
            newDocs.push(new Documento(componente.getId(), componente.get, componente.fechaCreacion, componente.fechaUltimaModificacion, componente.getIdUsuario(), doc.estado, doc.version));
        }
        return newDocs;
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