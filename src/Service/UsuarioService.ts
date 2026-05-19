import type { IUsuarioService } from "../Interfaces/IUsuarioService.js";
import { UsuarioRepository } from "../Database/Context/UsuarioRepository.js";
import { Usuario } from "../Models/Usuario.js";
import { UsuarioDto } from "../DTO/UsuarioDTO.js";
import { CarpetaRepository } from "../Database/Context/CarpetaRepository.js";
import { ComponenteRepository } from "../Database/Context/ComponenteRepository.js";
import { CarpetaService } from "./CarpetaService.js";


export class UsuarioService implements IUsuarioService {
    private usuarioRepo= new UsuarioRepository();
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
    //Preguntar al profe esto
    async addUsuario(usuarioDto: UsuarioDto): Promise<Usuario> {
        const carpetasPrincipales = ["Mi Area", "Compartidos conmigo", "Recientes", "Destacados"];
        const usuarioId = await this.usuarioRepo.crearUsuario(usuarioDto.nombre,usuarioDto.apellido,usuarioDto.email,usuarioDto.username,usuarioDto.password);
        await this.componenteRepo.crearComponente(usuarioId.toString(),usuarioId.toString(),"carpeta" ,session);
        await this.carpetaRepo.crear("", usuarioId.toString(), session);
        for (const nombreCarpeta of carpetasPrincipales) {
            await this.carpetaRepo.addCarpeta
        }
        return await this.getUsuarioById(usuarioId.toString());
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