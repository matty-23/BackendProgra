import { ComponenteModel } from '../Schemes/ComponenteScheme.js';
import { Componente } from '../../Models/Componente.js';
import type { IComponenteScheme } from '../../Interfaces/IComponenteScheme.js';
import mongoose, { Types } from 'mongoose';
import { transactionContext } from '../TransactionContext.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ComponenteRepository {

    async crearComponente(nombre: string, idUsuario: string,tipo: string): Promise<Types.ObjectId>{
        const session = transactionContext.getStore();
        try {
            const nuevoComponente = new ComponenteModel({
                _id: new mongoose.Types.ObjectId(),
                nombre: nombre,
                fechaCreacion: Date.now(),
                fechaUltimaModificacion: Date.now(),
                idUsuario: idUsuario,
                tipo: tipo
            });

            const docGuardado = await nuevoComponente.save({ ...(session ? { session } : {}), validateBeforeSave: false }); 
            return docGuardado._id;
        } catch (error) {
            throw error;
        } 

    }
    async obtenerPorId(id: string): Promise<Componente | null> {
        const session = transactionContext.getStore();
        const componente = await ComponenteModel.findOne({ _id: new Types.ObjectId(id) }).session(session || null).lean<IComponenteScheme>();
        if (!componente) return null;

        return new Componente(
            componente._id.toString(), 
            componente.nombre, 
            componente.fechaCreacion, 
            componente.fechaUltimaModificacion, 
            componente.idUsuario.toString(),
            componente.tipo
        );
    }
    async obtenerTodos(): Promise<Componente[]> {
        const componentes = await ComponenteModel.find().lean<IComponenteScheme[]>();
       return componentes.map(c => new Componente(
            c._id.toString(),
            c.nombre,
            c.fechaCreacion,
            c.fechaUltimaModificacion,
            c.idUsuario.toString(),
            c.tipo
        ));
    }
    async obtenerComponentesPorTipo(tipo: string): Promise<Componente[]> {
        const componentes = await ComponenteModel.find({ tipo: { $regex: new RegExp(`^${tipo}$`, 'i') } }).lean<IComponenteScheme[]>();
        return componentes.map(c => new Componente(
            c._id.toString(),
            c.nombre,
            c.fechaCreacion,
            c.fechaUltimaModificacion,
            c.idUsuario.toString(),
            c.tipo
        ));
    }
    async actualizar(id: string, datosActualizados: Componente): Promise<Componente | null> {
        const session = transactionContext.getStore();
        datosActualizados.setFechaUltimaModificacion(new Date());

        const componenteActualizado = await ComponenteModel.findOneAndUpdate({ _id: new Types.ObjectId(id) },{...datosActualizados},{ new: true }).session(session || null).exec();
        if (!componenteActualizado) return null;
        return new Componente(
        componenteActualizado._id.toString(),
        componenteActualizado.nombre,
        componenteActualizado.fechaCreacion,
        componenteActualizado.fechaUltimaModificacion,
        componenteActualizado.idUsuario.toString(),
        componenteActualizado.tipo);
    }
    
    async eliminar(id: string): Promise<boolean> {
        const session = transactionContext.getStore();
        const resultado = await ComponenteModel.deleteOne({ _id: new Types.ObjectId(id)}).session(session || null).exec();
        return resultado.deletedCount === 1;
    }
}