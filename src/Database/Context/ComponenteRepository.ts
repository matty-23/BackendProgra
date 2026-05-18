import { ComponenteModel } from '../Schemes/ComponenteScheme.js';
import { Componente } from '../../Models/Componente.js';
import type { IComponenteScheme } from '../../Interfaces/IComponenteScheme.js';
import mongoose, { Types } from 'mongoose';
import { ClientSession, ObjectId } from "mongodb";

export class ComponenteRepository {

    async crearComponente(nombre: string, idUsuario: string,tipo: string, session?: ClientSession): Promise<Types.ObjectId>{
        
        try {
            const nuevoComponente = new ComponenteModel({
                _id: new mongoose.Types.ObjectId(),
                nombre: nombre,
                fechaCreacion: Date.now(),
                fechaUltimaModificacion: Date.now(),
                idUsuario: idUsuario,
                tipo: tipo
            });

            const docGuardado = await nuevoComponente.save({ ...(session ? { session } : {}), validateBeforeSave: false }); // Pasamos la sesión
            
            return docGuardado._id;

        } catch (error) {
            throw error;
        } 

    }
    async obtenerPorId(id: string): Promise<Componente | null> {
        const componente = await ComponenteModel.findOne({ _id: new Types.ObjectId(id) }).lean<IComponenteScheme>();
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
        const componentes = await ComponenteModel.find({ tipo }).lean<IComponenteScheme[]>();
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
        datosActualizados.setFechaUltimaModificacion(new Date());

        const componenteActualizado = await ComponenteModel.findOneAndUpdate({ _id: new Types.ObjectId(id) },{...datosActualizados},{ new: true }).exec();
        if (!componenteActualizado) return null;
        return new Componente(
        componenteActualizado.id,
        componenteActualizado.nombre,
        componenteActualizado.fechaCreacion,
        componenteActualizado.fechaUltimaModificacion,
        componenteActualizado.idUsuario.toString(),
        componenteActualizado.tipo
    );
    }
    async eliminar(id: string): Promise<boolean> {
        const resultado = await ComponenteModel.deleteOne({ _id: new Types.ObjectId(id)   }).exec();
        return resultado.deletedCount === 1;
    }
}