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

    async obtenerPorId(id: Types.ObjectId): Promise<ICarpetaScheme | null> {
        const carpeta = await CarpetaModel.findOne({ _id: id }).lean<ICarpetaScheme>().exec();
        if (!carpeta) return null;
        return carpeta;
    }

    
    //Esto solo devuelve carpetas hijas de un componente. La logica para traer tanbien los documentos
    //tiene que estar en el service
    //La logica de tener que buscar los componentes y demas, no deberia estar en service??????
    /* async obtenerTodasLasCarpetasDeUnNivel(Idcomponentes:Componente[]): Promise<Carpeta[]> {
         
        const componentes: Componente[] | null = [];
        const repositorioComponente = new ComponenteRepository;
        const carpetas: Carpeta[] | null = [];

        for(const Idcomponente of Idcomponentes){
            const componente = await repositorioComponente.obtenerPorId(Idcomponente.getId());
            if (!componente){
                continue;
            }
            componentes.push(componente);
        }
        for(const componente of componentes){
            if (componente.getTipo() == "carpeta"){
                const carpeta = await this.obtenerPorId(componente.getId(), componente);
                if (carpeta) carpetas.push(carpeta);
            }
        }
        return carpetas;
    } */

    //La logica para actualizar la fecha tiene que estar en el servicio         
    //datosActualizados.fechaUltimaModificacion = new Date();
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