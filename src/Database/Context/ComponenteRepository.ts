import { ComponenteModel } from '../Schemes/ComponenteScheme.js';
import { Componente } from '../../Models/Componente.js';
import type { IComponenteScheme } from '../../Interfaces/IComponenteScheme.js';
import mongoose from 'mongoose';
const { connection } = mongoose;
import { CarpetaRepository } from './CarpetaRepository.js';
import { Carpeta } from '../../Models/Carpeta.js';
import type { Documento } from '../../Models/Documento.js';
import { DocumentoRepository } from './DocumentoRepository.js';
import { ObjectId } from "mongodb";

export class ComponenteRepository {


    private convertirADominio(componente: IComponenteScheme): Componente {
        return new Componente(
            componente.id,
            componente.nombre,
            componente.fechaCreacion,
            componente.fechaUltimaModificacion,
            componente.idUsuario,
            componente.idPadre,
            componente.tipo
        );
    }

    async crearComponenteCarpetaPrincipal(idUsuario:ObjectId): Promise<ObjectId> {
        try {
            const nuevoComponente = new ComponenteModel({
                nombre: "${idUsuario}",
                fechaCreacion: Date.now(),
                fechaUltimaModificacion: Date.now(),
                idUsuario: idUsuario,
                tipo: "carpeta"
            });

            await nuevoComponente.save();
            //Falta llamar a carpetaRepository para crear la carpeta raíz y asignar su ID al componente creado, además de crear las carpetas base dentro de la carpeta raíz
            //Tambien falta cambiar el modelo, esquema, borrar interfaz y demas de Componente, Documento y Carpeta
            await this.crearComponenteCarpetasBase("Mi Area", "Compartidos conmigo", "Recientes", "Destacados");

            return nuevoComponente._id;

        } catch (error) {
            throw error;
        }
    }


    async crearComponenteCarpeta(componente: Componente,carpeta: Carpeta): Promise<Componente> {
        const session = await connection.startSession();
        session.startTransaction();
        const carpetasRepository = new CarpetaRepository();

        try {
            const nuevoComponente = new ComponenteModel({
                id: componente.getId(),
                nombre: componente['nombre'],
                fechaCreacion: componente['fechaCreacion'],
                fechaUltimaModificacion: componente['fechaUltimaModificacion'],
                idUsuario: componente['idUsuario'],
                tipo: componente['tipo'],
                idtipoComponente: null // Se asignará después de crear el componente específico (Carpeta o Archivo) 
            });

            const docGuardado = await nuevoComponente.save({ session, validateBeforeSave: false });
            carpeta.setidPadre(docGuardado._id);
            const idCarpeta = await carpetasRepository.crear(carpeta);

            nuevoComponente.idtipoComponente = idCarpeta;

            await nuevoComponente.save({ session });
            await session.commitTransaction();
            return this.convertirADominio(docGuardado);

        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }

    }
    async crearComponenteDocumento(componente: Componente,documento: Documento): Promise<Componente>{
        const session = await connection.startSession();
        session.startTransaction();
        const documentosRepository = new DocumentoRepository();

        try {
            const nuevoComponente = new ComponenteModel({
                id: componente.getId(),
                nombre: componente['nombre'],
                fechaCreacion: componente['fechaCreacion'],
                fechaUltimaModificacion: componente['fechaUltimaModificacion'],
                idUsuario: componente['idUsuario'],
                tipo: componente['tipo'],
                idtipoComponente: null // Se asignará después de crear el componente específico (Carpeta o Archivo) 
            });

            const docGuardado = await nuevoComponente.save({ session, validateBeforeSave: false }); // Pasamos la sesión
            const idDocumento = await documentosRepository.crear(documento);

            nuevoComponente.idtipoComponente = idDocumento;

            await nuevoComponente.save({ session });
            await session.commitTransaction();
            return this.convertirADominio(docGuardado);

        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }

    }
    async obtenerPorId(id: number): Promise<Componente | null> {
        const doc = await ComponenteModel.findOne({ id }).exec();
        if (!doc) return null;
        return this.convertirADominio(doc);
    }
    async obtenerTodos(): Promise<Componente[]> {
        const docs = await ComponenteModel.find().exec();
        return docs.map(doc => this.convertirADominio(doc));
    }
    async obtenerComponenteTipo(tipo: string): Promise<Componente[]> {
        const docs = await ComponenteModel.find({ tipo }).exec();
        return docs.map(doc => this.convertirADominio(doc));
    }
    async actualizar(id: number, datosActualizados: Partial<IComponenteScheme>): Promise<Componente | null> {
        datosActualizados.fechaUltimaModificacion = new Date();

        const docActualizado = await ComponenteModel.findOneAndUpdate({ id }, datosActualizados, { new: true }).exec();

        if (!docActualizado) return null;
        return this.convertirADominio(docActualizado);
    }
    async eliminar(id: number): Promise<boolean> {
        const resultado = await ComponenteModel.deleteOne({ id }).exec();
        return resultado.deletedCount === 1;
    }
    async obtenerHijos(id:number): Promise<Componente[]>{
        const componentesHijos = await ComponenteModel.find({ IdPadre: id });
        return componentesHijos.map(c => this.convertirADominio(c));
    }

}