import { CarpetaModel } from '../Schemes/CarpetaScheme.js';
import { Carpeta } from '../../Models/Carpeta.js';
import mongoose, {  Types, type ObjectId } from 'mongoose';
import type { ICarpetaScheme } from '../../Interfaces/ICarpetaScheme.js';
import { Componente } from '../../Models/Componente.js';
import { ComponenteRepository } from './ComponenteRepository.js';

export class CarpetaRepository {

    
    async crear(ReadMe: string,id: Types.ObjectId, componentes: Types.ObjectId[]): Promise<Types.ObjectId>{
        const nuevaCarpeta = new CarpetaModel({
            _id: id,
            ReadMe: ReadMe,
            componentes: componentes
        });

        const carpetaCreada = await nuevaCarpeta.save();
        return carpetaCreada._id;
    }

    
    async obtenerPorId(id: Types.ObjectId,componente: Componente): Promise<Carpeta | null> {
        const carpeta = await CarpetaModel.findOne({ id }).lean<ICarpetaScheme>().exec();
        if (!carpeta) return null;
        const carpetaObtenida = new Carpeta(componente.getId(),componente['nombre'],componente['fechaCreacion'],componente['fechaUltimaModificacion'],componente['idUsuario'], carpeta.ReadMe, carpeta.componentes);
        return carpetaObtenida;
    }

    
    async obtenerTodasLasCarpetasDeUnNivel(Idcomponentes:Componente[]): Promise<Carpeta[]> {
         
        const componentes: Componente[] | null = [];
        const repositorioComponente = new ComponenteRepository;

        for(const Idcomponente in Idcomponentes){
            const componente = await repositorioComponente.obtenerPorId(Idcomponente)
            if (!componente){
                continue;
            }
            componentes.push(componente);
        }
        //Ahora falta hacer que por cada componente se cree una carpeta y al final el metodo devuelva eso
        return carpetas.map((c: ICarpetaScheme) => new Carpeta(componente.getId(),componente['nombre'],componente['fechaCreacion'],componente['fechaUltimaModificacion'],componente['idUsuario'], c.ReadMe,[]));
    }


    async actualizar(id: number, datosActualizados: Partial<ICarpetaScheme>): Promise<Carpeta | null> {
        datosActualizados.fechaUltimaModificacion = new Date();

        const docActualizado = await CarpetaModel.findOneAndUpdate({ id }, datosActualizados, { new: true }).lean<ICarpetaScheme>().exec();

        if (!docActualizado) return null;
        return this.convertirADominio(docActualizado);
    }



    async eliminar(id: number): Promise<boolean> {
        const resultado = await CarpetaModel.deleteOne({ id }).lean<ICarpetaScheme>().exec();
        return resultado.deletedCount === 1;
    }
}