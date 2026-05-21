import { Injectable } from "@nestjs/common";
import { UsuarioModel } from "../Schemes/UsuarioScheme.js";
import { Usuario } from "../../Models/Usuario.js";
import { transactionContext } from '../TransactionContext.js';
import { Types } from "mongoose";

@Injectable()
export class UsuarioRepository {

    async crearUsuario(nombre: string, apellido: string, email: string, username: string, password: string): Promise<Types.ObjectId> {
        const session = transactionContext.getStore();
        try {
            const nuevoUsuario = new UsuarioModel({
                _id: new Types.ObjectId(),
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
            console.log(error);
            throw error;
        } 
    }
    
    async obtenerUsuarioPorId(id: string): Promise<Usuario> {
        const session = transactionContext.getStore();
        const usuario = await UsuarioModel.findById(id).session(session || null).lean<Usuario>();
        if (!usuario) {
            throw new Error("Usuario no encontrado");
        }
        const nuevoUsuario = new Usuario(
            usuario['_id'].toString(),
            usuario['nombre'],
            usuario['apellido'],
            usuario['email'],
            usuario['username'],
            usuario['password'],
        );
        return nuevoUsuario;
    }
    async obtenerUsuarioPorUsername(username: string): Promise<Usuario> {
        const session = transactionContext.getStore();
        const usuario = await UsuarioModel.findOne({ username }).session(session || null).lean<Usuario>();
        if (!usuario) {
            throw new Error("Usuario no encontrado");
        }
        const nuevoUsuario = new Usuario(
            usuario['_id'].toString(),
            usuario['nombre'],
            usuario['apellido'],
            usuario['email'],
            usuario['username'],
            usuario['password'],
        );
        return nuevoUsuario;
    }
    async actualizarUsuario(id: string, usuario: Partial<Usuario>): Promise<void> {
        const result = await UsuarioModel.findByIdAndUpdate(id, usuario);
        if (!result) {
            throw new Error("Usuario no encontrado");
        }
    }
    async eliminarUsuario(id: string): Promise<void> {
        const session = transactionContext.getStore();
        const result = await UsuarioModel.findByIdAndDelete(id).session(session || null);
        if (!result) {
            throw new Error("Usuario no encontrado");
        }
    }
}