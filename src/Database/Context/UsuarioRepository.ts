import {ComponenteRepository} from "./ComponenteRepository.js";
import { UsuarioModel } from "../Schemes/UsuarioScheme.js";
import { Usuario } from "../../Models/Usuario.js";
import type { ClientSession, ObjectId, Types } from "mongoose";


export class UsuarioRepository {

    async crearUsuario(nombre: string, apellido: string, email: string, username: string, password: string, session?: ClientSession): Promise<Types.ObjectId> {
        const componenteRepository = new ComponenteRepository();
        try {
            const nuevoUsuario = new UsuarioModel({
                nombre: nombre,
                apellido: apellido,
                email: email,
                username: username,
                password: password,
                fechaCreacion: new Date()
            });
            const UsuarioNuevo =  await nuevoUsuario.save({ ...(session ? { session } : {}) });
            return UsuarioNuevo._id;
        } catch (error) {
            throw error;
        } 
    }
    
    async obtenerUsuarioPorId(id: string): Promise<Usuario> {
        //El lead<Usuario> convirte el documento Mongo a un objeto
        const usuario = await UsuarioModel.findById(id).lean<Usuario>();
        if (!usuario) {
            throw new Error("Usuario no encontrado");
        }
        return usuario;
    }
    async obtenerUsuarioPorUsername(username: string): Promise<Usuario> {
        const usuario = await UsuarioModel.findOne({ username }).lean<Usuario>();
        if (!usuario) {
            throw new Error("Usuario no encontrado");
        }
        return usuario;
    }
    async actualizarUsuario(id: string, usuario: Partial<Usuario>): Promise<void> {
        const result = await UsuarioModel.findByIdAndUpdate(id, usuario);
        if (!result) {
            throw new Error("Usuario no encontrado");
        }
    }
    async eliminarUsuario(id: string): Promise<void> {
        const result = await UsuarioModel.findByIdAndDelete(id);
        if (!result) {
            throw new Error("Usuario no encontrado");
        }
    }
}