import { CarpetaModel } from '../Schemes/CarpetaScheme.js';
import { Carpeta } from '../../Models/Carpeta.js';
import mongoose, { Types, type ObjectId } from 'mongoose';
import type { ICarpetaScheme } from '../../Interfaces/ICarpetaScheme.js';
import { Componente } from '../../Models/Componente.js';
import { ComponenteRepository } from './ComponenteRepository.js';
import { transactionContext } from '../TransactionContext.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CarpetaRepository {


    async crear(ReadMe: string, id: string, componentes: Componente[]): Promise<Types.ObjectId> {
        const session = transactionContext.getStore();
        const componentesIds: Types.ObjectId[] = componentes.map(c => new Types.ObjectId(c.getId()));

        const nuevaCarpeta = new CarpetaModel({
            _id: id,
            ReadMe: ReadMe,
            componentes: componentesIds
        });

        const carpetaCreada = await nuevaCarpeta.save({ ...(session ? { session } : {}) });
        return carpetaCreada._id;
    }
    async obtenerPorId(id: string, componente: Componente): Promise<Carpeta | null> {
        const session = transactionContext.getStore();
        const carpeta = await CarpetaModel.findOne({ _id: new Types.ObjectId(id) }).session(session || null).lean<ICarpetaScheme>().exec();
        if (!carpeta) return null;
        const carpetaActualizada = new Carpeta(componente.getId(), componente.getNombre(), componente.getFechaCreacion(), componente.getFechaUltimaModificacion(), componente.getIdUsuario(), carpeta.ReadMe, []);
        return carpetaActualizada;
    }

    async obtenerComponentesCarpeta(id: string): Promise<Componente[] | null> {
        const session = transactionContext.getStore();
        const carpeta = await CarpetaModel.findOne({ _id: new Types.ObjectId(id) }).session(session || null).lean<ICarpetaScheme>().exec();
        const repositorioComponente = new ComponenteRepository();
        const componentes: Componente[] = [];

        if (!carpeta) return null;
        await Promise.all(carpeta.componentes.map(id => repositorioComponente.obtenerPorId(id.toString())));
        return componentes;
    }

    async obtenerTodasLasCarpetasDeUnNivel(componentes: Componente[]): Promise<Carpeta[]> {

        const carpetasEncontradas = await Promise.all(componentes.filter(c => c.getTipo() === "carpeta").map(c => this.obtenerPorId(c.getId(), c)));
        const carpetas = carpetasEncontradas.filter((c): c is Carpeta => c !== null);
        return carpetas;
    }

    async actualizar(id: string, datosActualizados: Carpeta): Promise<Carpeta | null> {
    const session = transactionContext.getStore();
    const updateData: any = { ReadMe: datosActualizados.getReadMe() };
        
    if (datosActualizados.getComponentes() && datosActualizados.getComponentes().length > 0) {
        updateData.componentes = datosActualizados.getComponentes().map(c => new Types.ObjectId(c.getId()));
    }
    const carpetaActualizada = await CarpetaModel.findByIdAndUpdate(id,{ $set: updateData },{ new: true }).session(session || null).lean<Carpeta>().exec();
    if (!carpetaActualizada) return null;
    return carpetaActualizada;
}
    //Añadir la logica para eliminar todas las subcarpetas y componente dentro de la carpeta a eliminar
    async eliminar(id: string): Promise<boolean> {
        //Comprobar si la busqueda del ID esta bien
        const resultado = await CarpetaModel.deleteOne({ _id: new Types.ObjectId(id) }).exec();
        return resultado.deletedCount === 1;
    }
}