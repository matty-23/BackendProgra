import { DocumentoModel } from '../Schemes/DocumentoScheme.js';
import { Documento } from '../../Models/Documento.js';
import mongoose, { Types, type ObjectId } from 'mongoose';
import type { IDocumentoScheme } from '../../Interfaces/IDocumentoScheme.js';
import { ComponenteModel } from '../Schemes/ComponenteScheme.js';
import { ComponenteRepository } from './ComponenteRepository.js';
import { Componente } from '../../Models/Componente.js';

const componenteR = new ComponenteRepository();

export class DocumentoRepository {

    async crear(id: string, estado: string, version: string): Promise<mongoose.Types.ObjectId> {
        const nuevoDoc = new DocumentoModel({
            _id: id,
            estado: estado,
            version: version
        });

        const docGuardado = await nuevoDoc.save();
        return docGuardado._id;
    }


    async obtenerPorId(id: string, componente: Componente): Promise<Documento | null> {
        const doc = await DocumentoModel.findById(id).lean<IDocumentoScheme>().exec();
        if (!doc) return null;
        return new Documento(componente.getId(), componente.getNombre(), componente.getFechaCreacion(), componente.getFechaUltimaModificacion(), componente.getIdUsuario(), doc.estado, doc.version)
    }


    async obtenerTodos(componentes: Componente[]): Promise<Documento[]> {
        const repositorioComponente = new ComponenteRepository();
        const docs = await repositorioComponente.obtenerTodos();
        const newDocs = [];
        for (const doc of docs) {
            const componente = componentes.find(c => c.getId() === doc.getId());

            if (!componente) continue;
            newDocs.push(new Documento(componente.getId(), componente.getNombre(), componente.getFechaCreacion(), componente.getFechaUltimaModificacion(), componente.getIdUsuario(), doc.estado, doc.version));
        }
        return newDocs;
    }


    async actualizar(id: string, docActualizado: Documento): Promise<Documento | null> {

        const datosActualizados = {
            estado: docActualizado.getEstado(),
            version: docActualizado.getVersion()
        };

        const doc = await DocumentoModel.findByIdAndUpdate(
            id,
            datosActualizados,
            { new: true }
        ).lean<IDocumentoScheme>().exec();
        if (!doc) return null;
        return docActualizado
    }


    async eliminar(id: string): Promise<boolean> {
        const resultado = await DocumentoModel.deleteOne({ _id : id }).exec();
        return resultado.deletedCount === 1;
    }
}