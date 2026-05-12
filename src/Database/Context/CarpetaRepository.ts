import { CarpetaModel } from '../Schemes/CarpetaScheme.js';
import { Carpeta } from '../../Models/Carpeta.js';
import mongoose, {  Types, type ObjectId } from 'mongoose';
import type { ICarpetaScheme } from '../../Interfaces/ICarpetaScheme.js';
import type { Componente } from '../../Models/Componente.js';

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

    
    async obtenerPorId(id: number): Promise<Carpeta | null> {
        const doc = await CarpetaModel.findOne({ id }).exec();
        if (!doc) return null;
        return this.convertirADominio(doc);
    }

    
    async obtenerTodos(): Promise<Carpeta[]> {
        const docs = await CarpetaModel.find().exec();
        return docs.map(doc => this.convertirADominio(doc));
    }


    async actualizar(id: number, datosActualizados: Partial<ICarpetaScheme>): Promise<Carpeta | null> {
        datosActualizados.fechaUltimaModificacion = new Date();

        const docActualizado = await CarpetaModel.findOneAndUpdate({ id }, datosActualizados, { new: true }).exec();

        if (!docActualizado) return null;
        return this.convertirADominio(docActualizado);
    }



    async eliminar(id: number): Promise<boolean> {
        const resultado = await CarpetaModel.deleteOne({ id }).exec();
        return resultado.deletedCount === 1;
    }
}