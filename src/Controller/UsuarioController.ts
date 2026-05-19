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
            id: usuario.getId(),
            nombre: usuario.getNombre(),
            email: usuario.getEmail(),
            apellido: usuario.getApellido(),
            fechaCreacion: usuario.getFechaCreacion(),
            username: usuario.getUsername(),
            password: usuario.getPassword()
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
            id: usuario.getId(),
            nombre: usuario.getNombre(),
            email: usuario.getEmail(),
            apellido: usuario.getApellido(),
            fechaCreacion: usuario.getFechaCreacion(),
            username: usuario.getUsername(),
            password: usuario.getPassword()
        };
        return userDto;
    }

    @Post()
    @HttpCode(201)
    async addUsuario(@Body() usuarioDto: UsuarioDto): Promise<UsuarioDto> {
        try {
            const nuevoUsuario = await this._UsuarioService.addUsuario(usuarioDto); 
            const nuevoUsuarioDto: UsuarioDto = {
                id: nuevoUsuario.getId(),
                nombre: nuevoUsuario.getNombre(),
                email: nuevoUsuario.getEmail(),
                apellido: nuevoUsuario.getApellido(),
                fechaCreacion: nuevoUsuario.getFechaCreacion(),
                username: nuevoUsuario.getUsername(),
                password: nuevoUsuario.getPassword()
            };
            return nuevoUsuarioDto;
        } catch (error) {
            throw new BadRequestException("Error al crear el usuario");
        }
    }

    @Put(":id")
    async updateUsuario(@Param("id") id: string, @Body() usuarioDto: UsuarioDto): Promise<void> {
        if (id !== usuarioDto.id) {
            throw new BadRequestException("El ID del usuario no coincide con el ID proporcionado en la URL");
        }
        try {
            await this._UsuarioService.updateUsuario(usuarioDto);
        } catch (error) {
            throw new NotFoundException("Usuario no encontrado");
        }
    }
    
    @Delete(":id")
    async deleteUsuario(@Param("id") id: string): Promise<void> {
        try {
            await this._UsuarioService.deleteUsuario(id);
        } catch (error) {
            throw new NotFoundException("Usuario no encontrado");
        }
    }
}