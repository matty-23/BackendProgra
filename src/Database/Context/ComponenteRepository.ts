import { ComponenteModel } from '../Schemes/ComponenteScheme.js';
import { Componente } from '../../Models/Componente.js';
import type { IComponenteScheme } from '../../Interfaces/IComponenteScheme.js';
import mongoose, { Types } from 'mongoose';
import { ClientSession, ObjectId } from "mongodb";

export class ComponenteRepository {

    async crearComponenteCarpetaPrincipal(idUsuario:ObjectId,session?: ClientSession): Promise<void> {
        try {
            const nuevoComponente = new ComponenteModel({
                nombre: idUsuario.toString(),
                fechaCreacion: Date.now(),
                fechaUltimaModificacion: Date.now(),
                idUsuario: idUsuario,
                tipo: "carpeta"
            });
            await nuevoComponente.save({...(session ? { session } : {})});
        } catch (error) {
            throw error;
        }
    }
    //Pasamos la logica de creacion de las carpetas hijas al servicio
    async crearComponenteCarpeta(nombre: string, idUsuario: ObjectId,session?: ClientSession): Promise<Types.ObjectId> {

        try {
            const nuevoComponente = new ComponenteModel({
                nombre: nombre,
                fechaCreacion: Date.now(),
                fechaUltimaModificacion: Date.now(),
                idUsuario: idUsuario,
                tipo: "carpeta",
            });

            const docGuardado = await nuevoComponente.save({ ...(session ? { session } : {}), validateBeforeSave: false });
            await nuevoComponente.save({ ...(session ? { session } : {})});
            return docGuardado._id;

        } catch (error) {
            throw error;
        } 

    }
    async crearComponenteDocumento(nombre: string, idUsuario: ObjectId,session?: ClientSession): Promise<Types.ObjectId>{
        
        try {
            const nuevoComponente = new ComponenteModel({
                nombre: nombre,
                fechaCreacion: Date.now(),
                fechaUltimaModificacion: Date.now(),
                idUsuario: idUsuario,
                tipo: "documento"
            });

            const docGuardado = await nuevoComponente.save({ ...(session ? { session } : {}), validateBeforeSave: false }); // Pasamos la sesión
            
            return docGuardado._id;

        } catch (error) {
            throw error;
        } 

    }
    async obtenerPorId(id: Types.ObjectId): Promise<Componente | null> {
        const componente = await ComponenteModel.findOne({ id }).lean<Componente>();
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
    async actualizar(id: number, datosActualizados: Partial<IComponenteScheme>): Promise<Componente | null> {
        datosActualizados.fechaUltimaModificacion = new Date();

        const componenteActualizado = await ComponenteModel.findOneAndUpdate({ id }, datosActualizados, { new: true }).lean<Componente>();

        if (!componenteActualizado) return null;
        return componenteActualizado;
    }
    async eliminar(id: Types.ObjectId): Promise<boolean> {
        const resultado = await ComponenteModel.deleteOne({ id }).exec();
        return resultado.deletedCount === 1;
    }

}