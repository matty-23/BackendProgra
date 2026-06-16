import { DocumentoModel } from '../Schemes/DocumentoScheme.js';
import { Documento } from '../../Models/Documento.js';
import mongoose, { Types, type ObjectId } from 'mongoose';
import type { IDocumentoScheme } from '../../Interfaces/IDocumentoScheme.js';
import { ComponenteRepository } from './ComponenteRepository.js';
import { Componente } from '../../Models/Componente.js';
import { transactionContext } from '../TransactionContext.js';
import { Injectable, Inject, forwardRef } from '@nestjs/common';

@Injectable() 
export class DocumentoRepository {

    constructor(@Inject(forwardRef(() => ComponenteRepository)) private readonly componenteR: ComponenteRepository) {}

    async crear(id: string, estado: string, version: string): Promise<mongoose.Types.ObjectId> {
        const session = transactionContext.getStore(); 
        
        const nuevoDoc = new DocumentoModel({
            _id: id,
            estado: estado,
            version: version
        });
        const docGuardado = await nuevoDoc.save({ ...(session ? { session } : {}) }); 
        return docGuardado._id as mongoose.Types.ObjectId;
    }

    async obtenerPorId(id: string, componente: Componente): Promise<Documento | null> {
        const session = transactionContext.getStore();
        const doc = await DocumentoModel.findById(id).session(session || null).lean<IDocumentoScheme>().exec();
        if (!doc) return null;
        
        return new Documento(componente.getId(), componente.getNombre(), componente.getFechaCreacion(), componente.getFechaUltimaModificacion(), componente.getIdUsuario(), doc.estado, doc.version);
    }

    async obtenerTodos(componentes: Componente[]): Promise<Documento[]> {
        const newDocs: Documento[] = [];
        for (const componente of componentes) {
            if (componente.getTipo() !== "documento") continue;
            const doc = await this.obtenerPorId(componente.getId(), componente);
            if (!doc) continue;
            newDocs.push(doc);
        }
        return newDocs;
    }

    async actualizar(id: string, docActualizado: Documento): Promise<Documento | null> {
        const session = transactionContext.getStore();
        const datosActualizados = {
            estado: docActualizado.getEstado(),
            version: docActualizado.getVersion()
        };

        const doc = await DocumentoModel.findByIdAndUpdate(
            id,
            datosActualizados,
            { new: true, session: session || null }
        ).lean<IDocumentoScheme>().exec();
        if (!doc) return null;
        return docActualizado;
    }

    async eliminar(id: string): Promise<boolean> {
        const session = transactionContext.getStore();
        const resultado = await DocumentoModel.deleteOne({ _id : id }).session(session || null).exec();
        return resultado.deletedCount === 1;
    }
}