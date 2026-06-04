import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { TransactionManager } from '../Database/TransactionManager.js';
import type { IUsuarioService } from "../Interfaces/IUsuarioService.js";
import { UsuarioRepository } from "../Database/Context/UsuarioRepository.js";
import { Usuario } from "../Models/Usuario.js";
import { UsuarioDto } from "../DTO/UsuarioDTO.js";
import { CarpetaDto } from "../DTO/CarpetaDTO.js";
import type { ICarpetaService } from '../Interfaces/ICarpetaService.js';

@Injectable()
export class UsuarioService implements IUsuarioService {

    constructor(
        @Inject(forwardRef(() => TransactionManager)) private readonly txManager: TransactionManager,
        @Inject(forwardRef(() => UsuarioRepository)) private readonly usuarioRepo: UsuarioRepository,
        @Inject('ICarpetaService') private readonly carpetaService: ICarpetaService
    ) {}

    async getUsuarioById(id: string): Promise<Usuario | null> {
        return await this.usuarioRepo.obtenerUsuarioPorId(id);
    }

    async getUsuarioByUsername(username: string): Promise<Usuario | null> {
        return await this.usuarioRepo.obtenerUsuarioPorUsername(username);
    }

    async getUsuarioByEmail(email: string): Promise<Usuario | null> {
        return await this.usuarioRepo.obtenerUsuarioPorEmail(email);
    }

    async addUsuario(usuarioDto: UsuarioDto): Promise<Usuario> {
        const carpetasPrincipales = ["Mi Area", "Compartidos conmigo", "Recientes", "Destacados"];
        
        return await this.txManager.execute(async () => {
            if (!usuarioDto.nombre || !usuarioDto.apellido || !usuarioDto.email || !usuarioDto.username || !usuarioDto.password) {
                throw new Error('Faltan campos obligatorios para crear el usuario');
            }            

            const usuarioId = await this.usuarioRepo.crearUsuario(usuarioDto.nombre, usuarioDto.apellido, usuarioDto.email, usuarioDto.username, usuarioDto.password);

            const carpetaPrincipalDto: CarpetaDto = { nombre: usuarioId.toString(),fechaCreacion: new Date(),fechaUltimaModificacion: new Date(),idUsuario: usuarioId.toString(),ReadMe: ""};

            const carpetaPrincipal = await this.carpetaService.addCarpeta(carpetaPrincipalDto);
            
            for (const nombreCarpeta of carpetasPrincipales) {
                const carpetaDto: CarpetaDto = {
                    nombre: nombreCarpeta,
                    fechaCreacion: new Date(),
                    fechaUltimaModificacion: new Date(),
                    idUsuario: usuarioId.toString(),
                    ReadMe: ""
                };
                const carpeta = await this.carpetaService.addCarpeta(carpetaDto);
                if (!carpeta) throw new Error(`Error al crear la carpeta ${nombreCarpeta}`);
                
                carpetaPrincipal.AñadirElemento(carpeta);
            }

            const actualizarCarpetaPrincipal = await this.carpetaService.updateCarpeta(carpetaPrincipal.getId(), carpetaPrincipal);
            if (!actualizarCarpetaPrincipal) throw new Error("Error al actualizar la carpeta principal del usuario");
            
            const usuario = await this.getUsuarioById(usuarioId.toString());
            if (!usuario) throw new Error("Error crítico al recuperar el usuario recién creado");
            
            return usuario;
        });
    }

    async updateUsuario(usuario: UsuarioDto): Promise<boolean> {
        try {
            await this.usuarioRepo.actualizarUsuario(usuario.id, {
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
                username: usuario.username
            } as Partial<Usuario>);
            return true;
        } catch (error) {
            throw new Error("Error al actualizar el usuario");
        }
    }

    async deleteUsuario(id: string): Promise<boolean> {
        return await this.txManager.execute(async () => {
            const carpetas = await this.carpetaService.getCarpetasUsuario(id);
            const carpetaPrincipal = carpetas.find(c => c.getNombre() === id);
            
            if (carpetaPrincipal) {
                const carpetasBorradas = await this.carpetaService.deleteCarpeta(carpetaPrincipal.getId());
                if (!carpetasBorradas) {
                    throw new Error("Fallo al eliminar las carpetas asociadas al usuario.");
                }
            }

            await this.usuarioRepo.eliminarUsuario(id);
            return true;
        });
    }
}