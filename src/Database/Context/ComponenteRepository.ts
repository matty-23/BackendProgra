import { ComponenteModel } from '../Schemes/ComponenteScheme.js';
import { Componente } from '../../Models/Componente.js';
import type { IComponenteScheme } from '../../Interfaces/IComponenteScheme.js';
import mongoose, { Types } from 'mongoose';
const { connection } = mongoose;
import { CarpetaRepository } from './CarpetaRepository.js';
import { Carpeta } from '../../Models/Carpeta.js';
import type { Documento } from '../../Models/Documento.js';
import { DocumentoRepository } from './DocumentoRepository.js';
import { ObjectId } from "mongodb";

export class ComponenteRepository {

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
            const carpetasPrincipales = ["Mi Area", "Compartidos conmigo", "Recientes", "Destacados"];
            for (const nombreCarpeta of carpetasPrincipales) {
                const componente=new Componente({
                    nombre: nombreCarpeta,
                    fechaCreacion: Date.now(),
                    fechaUltimaModificacion: Date.now(),
                    idUsuario: idUsuario,
                    tipo: "carpeta"
                });
                await this.crearComponenteCarpeta(componente, "", []);
            }//Falta arreglar flujo. Al crear la carpeta raiz, se crean las carpetas principales dentro de la raíz, pero no se asigna el id de la carpeta raíz a los componentes de las carpetas principales, ni se asigna el id del componente carpeta raíz a los componentes de las carpetas principales. Además, falta asignar el id del componente carpeta raíz al usuario que se está creando. Esto hace que al obtener el usuario por id, no se pueda obtener su carpeta raíz ni las carpetas principales dentro de la raíz.
            return nuevoComponente._id;

        } catch (error) {
            throw error;
        }
    }

    async crearComponenteCarpeta(componente: Componente,ReadMe: string, componentes: Types.ObjectId[]): Promise<Componente> {
        const session = await connection.startSession();
        session.startTransaction();
        const carpetasRepository = new CarpetaRepository();

        try {
            const nuevoComponente = new ComponenteModel({
                nombre: componente['nombre'],
                fechaCreacion: componente['fechaCreacion'],
                fechaUltimaModificacion: componente['fechaUltimaModificacion'],
                idUsuario: componente['idUsuario'],
                tipo: componente['tipo'],
            });

            const docGuardado = await nuevoComponente.save({ session, validateBeforeSave: false });
            const idCarpeta = await carpetasRepository.crear(ReadMe, docGuardado._id, componentes);

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
        const componente = await ComponenteModel.findOne({ id }).lean<Componente>();
        if (!componente) return null;

        return componente;
    }
    async obtenerTodos(): Promise<Componente[]> {
        const componentes = await ComponenteModel.find().lean<Componente[]>();
        return componentes;
    }
    async obtenerComponenteTipo(tipo: string): Promise<Componente[]> {
        const componentes = await ComponenteModel.find({ tipo }).lean<Componente[]>();
        return componentes;
    }
    async actualizar(id: number, datosActualizados: Partial<IComponenteScheme>): Promise<Componente | null> {
        datosActualizados.fechaUltimaModificacion = new Date();

        const componenteActualizado = await ComponenteModel.findOneAndUpdate({ id }, datosActualizados, { new: true }).lean<Componente>();

        if (!componenteActualizado) return null;
        return componenteActualizado;
    }
    async eliminar(id: number): Promise<boolean> {
        const resultado = await ComponenteModel.deleteOne({ id }).exec();
        return resultado.deletedCount === 1;
    }

}