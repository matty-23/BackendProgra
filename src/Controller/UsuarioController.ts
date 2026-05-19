import { Controller, Get, Param, NotFoundException, Post, Body, BadRequestException, HttpCode, Put, Delete, Inject } from '@nestjs/common';
import { UsuarioDto } from '../DTO/UsuarioDTO.js';
import type { IUsuarioService } from '../Interfaces/IUsuarioService.js';

@Controller('api/Usuarios')
export class UsuarioController {
    constructor(@Inject('IUsuarioService') private readonly _UsuarioService: IUsuarioService) { }

    @Get(":id")
    async getUsuario(@Param("id") id: string): Promise<UsuarioDto> {
        const usuario = await this._UsuarioService.getUsuarioById(id);

        if (!usuario) {
            throw new NotFoundException("Usuario no encontrado");
        }

        const userDto: UsuarioDto = {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            apellido: usuario.apellido,
            fechaCreacion: usuario.fechaCreacion,
            username: usuario.username,
            password: usuario.password
        };

        return userDto;
    }
    @Get(":username")
    async getUsuarioByUsername(@Param("username") username: string): Promise<UsuarioDto> {
        const usuario = await this._UsuarioService.getUsuarioByUsername(username);
        if (!usuario) {
            throw new NotFoundException("Usuario no encontrado");
        }
        const userDto: UsuarioDto = {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            apellido: usuario.apellido,
            fechaCreacion: usuario.fechaCreacion,
            username: usuario.username,
            password: usuario.password
        };
        return userDto;
    }

}