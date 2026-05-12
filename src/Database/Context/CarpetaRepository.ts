import { CarpetaModel } from '../Schemes/CarpetaScheme.js';
import { Carpeta } from '../../Models/Carpeta.js';
import mongoose from 'mongoose';
import type { ICarpetaScheme } from '../../Interfaces/ICarpetaScheme.js';
import type { Componente } from '../../Models/Componente.js';

export class CarpetaRepository {

   
    private convertirADominio(carpeta: ICarpetaScheme): Carpeta {
        return new Carpeta(
            carpeta.id,
            carpeta.nombre,
            carpeta.fechaCreacion,
            carpeta.fechaUltimaModificacion,
            carpeta.idUsuario,
            carpeta.idPadre,
            carpeta.ReadMe
        ); 
    }

    
    async crear(carpeta: Carpeta): Promise<mongoose.Types.ObjectId>{
        const nuevaCarpeta = new CarpetaModel({
            id: carpeta.getId(),
            nombre: carpeta['nombre'],
            fechaCreacion: carpeta['fechaCreacion'],
            fechaUltimaModificacion: carpeta['fechaUltimaModificacion'],
            idUsuario: carpeta['idUsuario'],
            tipo: carpeta['tipo'],
            idPadre: carpeta['idPadre'],
            ReadMe: carpeta['ReadMe']
        });

        const docGuardado = await nuevaCarpeta.save();
        return docGuardado._id;
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