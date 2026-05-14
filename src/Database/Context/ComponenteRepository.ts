import { ComponenteModel } from '../Schemes/ComponenteScheme.js';
import { Componente } from '../../Models/Componente.js';
import type { IComponenteScheme } from '../../Interfaces/IComponenteScheme.js';
import mongoose, { Types } from 'mongoose';
import { ClientSession, ObjectId } from "mongodb";

export class ComponenteRepository {

    async crearComponente(nombre: string, idUsuario: string,tipo: string, session?: ClientSession): Promise<Types.ObjectId>{
        
        try {
            const nuevoComponente = new ComponenteModel({
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
        const componente = await ComponenteModel.findOne({ _id: new Types.ObjectId(id)  }).lean<Componente>();
        if (!componente) return null;

        return componente;
    }
    async obtenerTodos(): Promise<Componente[]> {
        const componentes = await ComponenteModel.find().lean<Componente[]>();
        return componentes;
    }
    async obtenerComponentesPorTipo(tipo: string): Promise<Componente[]> {
        const componentes = await ComponenteModel.find({ tipo }).lean<Componente[]>();
        return componentes;
    }
    async actualizar(id: string, datosActualizados: Partial<IComponenteScheme>): Promise<Componente | null> {
        datosActualizados.fechaUltimaModificacion = new Date();

        const componenteActualizado = await ComponenteModel.findOneAndUpdate({ _id: new Types.ObjectId(id)  }, datosActualizados, { new: true }).lean<Componente>();

        if (!componenteActualizado) return null;
        return componenteActualizado;
    }
    async eliminar(id: string): Promise<boolean> {
        const resultado = await ComponenteModel.deleteOne({ _id: new Types.ObjectId(id)   }).exec();
        return resultado.deletedCount === 1;
    }

}