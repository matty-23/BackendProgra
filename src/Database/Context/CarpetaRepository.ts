import { CarpetaModel } from '../Schemes/CarpetaScheme.js';
import { Carpeta } from '../../Models/Carpeta.js';
import mongoose, {  Types, type ObjectId } from 'mongoose';
import type { ICarpetaScheme } from '../../Interfaces/ICarpetaScheme.js';
import { Componente } from '../../Models/Componente.js';
import { ComponenteRepository } from './ComponenteRepository.js';

export class CarpetaRepository {

    
    async crear(ReadMe: string,id: Types.ObjectId, componentes: Componente[]): Promise<Types.ObjectId>{
        const componentesIds: Types.ObjectId[] = componentes.map(c => c.getId());
        const nuevaCarpeta = new CarpetaModel({
            _id: id,
            ReadMe: ReadMe,
            componentes: componentesIds
        });

        const carpetaCreada = await nuevaCarpeta.save();
        return carpetaCreada._id;
    }

    async obtenerPorId(id: Types.ObjectId,componente:Componente): Promise<Carpeta | null> {
        const carpeta = await CarpetaModel.findOne({ _id: id }).lean<Carpeta>().exec();
        if (!carpeta) return null;
        const carpetaActualizada=new Carpeta(componente.getId(),componente['nombre'], componente['fechaCreacion'],componente['fechaUltimaModificacion'],componente['idUsuario'],carpeta.getReadMe(),[]);
        return carpetaActualizada;
    }

    async obtenerComponentesCarpeta(id:Types.ObjectId):Promise<Componente[] | null>{
        const carpeta = await CarpetaModel.findOne({ _id: id }).lean<ICarpetaScheme>().exec();
        const repositorioComponente= new ComponenteRepository();
        const componentes : Componente[] = [];

        if (!carpeta) return null;
        for (const idComponente of carpeta.componentes){
            const componente= await repositorioComponente.obtenerPorId(idComponente);
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

    async actualizar(id: Types.ObjectId, datosActualizados: ICarpetaScheme): Promise<ICarpetaScheme | null> {
        const carpetaActualizado = await CarpetaModel.findByIdAndUpdate({ _id: id  }, datosActualizados, { new: true }).lean<ICarpetaScheme>().exec();

        if (!carpetaActualizado) return null;
        return carpetaActualizado;
    }

    //Mismo caso, la logica para eliminar el respectivo componente tiene que estar en servicio
    async eliminar(id: Types.ObjectId): Promise<boolean> {
        //Comprobar si la busqueda del ID esta bien
        const resultado = await CarpetaModel.deleteOne({ _id: id }).exec();
        return resultado.deletedCount === 1;
    }
}