import { CarpetaModel } from '../Schemes/CarpetaScheme.js';
import { Carpeta } from '../../Models/Carpeta.js';
import mongoose, { Types, type ObjectId } from 'mongoose';
import type { ICarpetaScheme } from '../../Interfaces/ICarpetaScheme.js';
import { Componente } from '../../Models/Componente.js';
import { ComponenteRepository } from './ComponenteRepository.js';

export class CarpetaRepository {


    async crear(ReadMe: string, id: string, componentes: Componente[]): Promise<Types.ObjectId> {
        const componentesIds: Types.ObjectId[] = componentes.map(c => new Types.ObjectId(c.getId()));

        const nuevaCarpeta = new CarpetaModel({
            _id: id,
            ReadMe: ReadMe,
            componentes: componentesIds
        });

        const carpetaCreada = await nuevaCarpeta.save();
        return carpetaCreada._id;
    }
    async obtenerPorId(id: string, componente: Componente): Promise<Carpeta | null> {
        const carpeta = await CarpetaModel.findOne({ _id: new Types.ObjectId(id) }).lean<Carpeta>().exec();
        if (!carpeta) return null;
        const carpetaActualizada = new Carpeta(componente.getId(), componente['nombre'], componente['fechaCreacion'], componente['fechaUltimaModificacion'], componente['idUsuario'], carpeta.getReadMe(), []);
        return carpetaActualizada;
    }

    async obtenerComponentesCarpeta(id: string): Promise<Componente[] | null> {
        const carpeta = await CarpetaModel.findOne({ _id: new Types.ObjectId(id) }).lean<ICarpetaScheme>().exec();
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
    const updateData = {
        nombre: datosActualizados.getNombre(),
        ReadMe: datosActualizados.getReadMe(),
        componentes: datosActualizados.getComponentes().map(c => new Types.ObjectId(c.getId()))};
    
    const carpetaActualizada = await CarpetaModel.findByIdAndUpdate(id,{ $set: updateData },{ new: true }).lean<Carpeta>().exec();
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