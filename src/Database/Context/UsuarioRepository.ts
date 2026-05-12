import {ComponenteRepository} from "./ComponenteRepository.js";
import { UsuarioModel } from "../Schemes/UsuarioScheme.js";
import { Usuario } from "../../Models/Usuario.js";
import type { Types } from "mongoose";
import mongoose from 'mongoose';

export class UsuarioRepository {
    async crearUsuario(usuario: Usuario): Promise<void> {
        const session = await mongoose.connection.startSession();
        session.startTransaction();
        const componenteRepository = new ComponenteRepository();
        try {
            const nuevoUsuario = new UsuarioModel({
                nombre: usuario.getNombre(),
                apellido: usuario.getApellido(),
                email: usuario.getEmail(),
                username: usuario.getUsername(),
                password: usuario.getPassword(),
                idCarpetaRaiz: null, // Se asignará después de crear la carpeta raíz
                fechaCreacion: usuario.getFechaCreacion()
            });
            const UsuarioNuevo =  await nuevoUsuario.save({ session });
            const CarpetaRaiz = await componenteRepository.crearComponenteCarpetaPrincipal(UsuarioNuevo._id);
            await nuevoUsuario.updateOne({ idCarpetaRaiz: CarpetaRaiz }, { session });
            await session.commitTransaction();

        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }
    //A partir de aca falta el resto. CrearUsuario esta terminado
    async obtenerUsuarioPorId(id: Types.ObjectId): Promise<Usuario | null> {
        return await UsuarioModel.findById(id).lean();
    }
    async obtenerUsuarioPorUsername(username: string): Promise<Usuario | null> {
        return await UsuarioModel.findOne({ username }).lean();
    }
    async actualizarUsuario(id: Types.ObjectId, usuario: Partial<Usuario>): Promise<void> {
        await UsuarioModel.findByIdAndUpdate(id, usuario);
    }
    async eliminarUsuario(id: Types.ObjectId): Promise<void> {
        await UsuarioModel.findByIdAndDelete(id);
    }
}