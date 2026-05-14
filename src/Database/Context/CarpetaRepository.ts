import { CarpetaModel } from '../Schemes/CarpetaScheme.js';
import { Carpeta } from '../../Models/Carpeta.js';
import mongoose, {  Types, type ObjectId } from 'mongoose';
import type { ICarpetaScheme } from '../../Interfaces/ICarpetaScheme.js';
import { Componente } from '../../Models/Componente.js';
import { ComponenteRepository } from './ComponenteRepository.js';

export class CarpetaRepository {

    
    async crear(ReadMe: string,id: string, componentes: Componente[]): Promise<Types.ObjectId>{
        const componentesIds: Types.ObjectId[] = componentes.map(c => new Types.ObjectId(c.getId()));

        const nuevaCarpeta = new CarpetaModel({
            _id: id,
            ReadMe: ReadMe,
            componentes: componentesIds
        });

        const carpetaCreada = await nuevaCarpeta.save();
        return carpetaCreada._id;
    }
    async obtenerPorId(id: string,componente:Componente): Promise<Carpeta | null> {
        const carpeta = await CarpetaModel.findOne({ _id: new Types.ObjectId(id) }).lean<Carpeta>().exec();
        if (!carpeta) return null;
        const carpetaActualizada=new Carpeta(componente.getId(),componente['nombre'], componente['fechaCreacion'],componente['fechaUltimaModificacion'],componente['idUsuario'],carpeta.getReadMe(),[]);
        return carpetaActualizada;
    }

    async obtenerComponentesCarpeta(id:string):Promise<Componente[] | null>{
        const carpeta = await CarpetaModel.findOne({ _id: new Types.ObjectId(id) }).lean<ICarpetaScheme>().exec();
        const repositorioComponente= new ComponenteRepository();
        const componentes : Componente[] = [];

        if (!carpeta) return null;
        for (const idComponente of carpeta.componentes){
            const componente= await repositorioComponente.obtenerPorId(idComponente.toString());
            if (!componente) continue
            componentes.push(componente);
        }
        return componentes;
    }
    async obtenerTodasLasCarpetasDeUnNivel(componentes:Componente[]): Promise<Carpeta[]> {
        const carpetas: Carpeta[] | null = [];

        for(const componente of componentes){
            if (componente.getTipo() == "carpeta"){
                const carpeta = await this.obtenerPorId(componente.getId(),componente);
                if (carpeta) carpetas.push(carpeta);
            }
        }
        return carpetas;
    }

    async actualizar(id: string, datosActualizados: Carpeta): Promise<Carpeta | null> {
        const carpetaActualizado = await CarpetaModel.findByIdAndUpdate({ _id:  new Types.ObjectId(id)  }, {datosActualizados}, { new: true }).lean<Carpeta>().exec();

        if (!carpetaActualizado) return null;
        return carpetaActualizado;
    }

    //Mismo caso, la logica para eliminar el respectivo componente tiene que estar en servicio
    async eliminar(id: string): Promise<boolean> {
        //Comprobar si la busqueda del ID esta bien
        const resultado = await CarpetaModel.deleteOne({ _id:  new Types.ObjectId(id) }).exec();
        return resultado.deletedCount === 1;
    }
}