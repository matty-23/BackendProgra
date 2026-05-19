import type { IUsuarioService } from "../Interfaces/IUsuarioService.js";
import { UsuarioRepository } from "../Database/Context/UsuarioRepository.js";
import { Usuario } from "../Models/Usuario.js";
import { UsuarioDto } from "../DTO/UsuarioDTO.js";
import { CarpetaRepository } from "../Database/Context/CarpetaRepository.js";
import { ComponenteRepository } from "../Database/Context/ComponenteRepository.js";
import { CarpetaService } from "./CarpetaService.js";
import mongoose from "mongoose";

export class UsuarioService implements IUsuarioService {
    private usuarioRepo = new UsuarioRepository();
    private carpetaRepo = new CarpetaService();

    async getUsuarioById(id: string): Promise<Usuario> {
        const usuario = await this.usuarioRepo.obtenerUsuarioPorId(id);
        if (!usuario) {
            throw new Error("Usuario no encontrado");
        }
        return usuario;
    }
    async getUsuarioByUsername(username: string): Promise<Usuario> {
        const usuario = await this.usuarioRepo.obtenerUsuarioPorUsername(username);
        if (!usuario) {
            throw new Error("Usuario no encontrado");
        }
        return usuario;
    }
    //Preguntar al profe si esta bien el flujo o como deberia hacerse
    async addUsuario(usuarioDto: UsuarioDto): Promise<Usuario> {
        const carpetasPrincipales = ["Mi Area", "Compartidos conmigo", "Recientes", "Destacados"];
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            //Flujo deberia ser
            //Crear Usuario 
            //Crear Carpeta (crear carpeta tambien crea el componente)(En tal caso, como manejo el tema de las sesiones??)
            //Crear carpetas principales del usuario
            //Añadirlas a componentes[] de la carpeta principal
            //Actualizar la carpeta principal
            //Devolver el usuario creado
            const usuarioId = await this.usuarioRepo.crearUsuario(usuarioDto.nombre, usuarioDto.apellido, usuarioDto.email, usuarioDto.username, usuarioDto.password);
            await this.componenteRepo.crearComponente(usuarioId.toString(), usuarioId.toString(), "carpeta", session);
            await this.carpetaRepo.crear("", usuarioId.toString(), session);
            for (const nombreCarpeta of carpetasPrincipales) {
                await this.carpetaRepo.addCarpeta
            }
            await session.commitTransaction();
            return await this.getUsuarioById(usuarioId.toString());
        }
        catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        } finally {
            session.endSession();
        }
    }
    async updateUsuario(usuario: UsuarioDto): Promise<boolean> {
        const usuarioAactualizar = new Usuario(usuario.id, usuario.nombre, usuario.apellido, usuario.email, usuario.username, usuario.password);
        try {
            await this.usuarioRepo.actualizarUsuario(usuario.id, usuarioAactualizar);
        } catch (error) {
            throw new Error("Error al actualizar el usuario");
        }
        return true;
    }
    async deleteUsuario(id: string): Promise<boolean> {
        try {
            await this.usuarioRepo.eliminarUsuario(id);
        } catch (error) {
            throw new Error("Error al eliminar el usuario");
        }
        return true;
    }
}