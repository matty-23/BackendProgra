import { Controller, Inject, UseGuards } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { UsuarioDto } from '../DTO/UsuarioDTO.js';
import type { IUsuarioService } from '../Interfaces/IUsuarioService.js';
import { JwtGrpcAuthGuard } from '../Guards/JwtAuthGuard.js'; 

@Controller()
@UseGuards(JwtGrpcAuthGuard)
export class UsuarioController {
    constructor(@Inject('IUsuarioService') private readonly _UsuarioService: IUsuarioService) { }

    @GrpcMethod('UsuarioService', 'GetById')
    async getById(data: { id: string }): Promise<UsuarioDto> {
        const usuario = await this._UsuarioService.getUsuarioById(data.id);

        if (!usuario) {
            throw new RpcException({
                code: status.NOT_FOUND, 
                message: `Usuario con ID ${data.id} no encontrado.`
            });
        }
        return {
            id: usuario.getId(),
            nombre: usuario.getNombre(),
            email: usuario.getEmail(),
            apellido: usuario.getApellido(),
            fechaCreacion: usuario.getFechaCreacion(),
            username: usuario.getUsername()
        };
    }

    @GrpcMethod('UsuarioService', 'GetByUsername')
    async getUsuarioByUsername(data: { username: string }): Promise<UsuarioDto> {
        const usuario = await this._UsuarioService.getUsuarioByUsername(data.username);
        
        if (!usuario) {
            throw new RpcException({
                code: status.NOT_FOUND, // Código 5
                message: `Usuario con username ${data.username} no encontrado.`
            });
        }

        return {
            id: usuario.getId(),
            nombre: usuario.getNombre(),
            email: usuario.getEmail(),
            apellido: usuario.getApellido(),
            fechaCreacion: usuario.getFechaCreacion(),
            username: usuario.getUsername()
        };
    }

    @GrpcMethod('UsuarioService', 'Actualizar')
    async actualizar(data: { id: string, usuario: UsuarioDto }): Promise<{ success: boolean }> {
        if (data.id !== data.usuario.id) {
            throw new RpcException({
                code: status.INVALID_ARGUMENT, 
                message: "El ID de la ruta no coincide con el ID del cuerpo de la petición."
            });
        }

        try {
            const actualizado = await this._UsuarioService.updateUsuario(data.usuario);
            
            if (!actualizado) {
                throw new RpcException({
                    code: status.NOT_FOUND, 
                    message: `Usuario con ID ${data.id} no encontrado para actualizar.`
                });
            }
            
            return { success: true };
        } catch (error: any) {
            if (error instanceof RpcException) throw error;

            throw new RpcException({
                code: status.INTERNAL,
                message: error.message || "Error interno al actualizar el usuario."
            });
        }
    }
    
    @GrpcMethod('UsuarioService', 'Eliminar')
    async eliminar(data: { id: string }): Promise<{ success: boolean }> {
        try {
            const eliminado = await this._UsuarioService.deleteUsuario(data.id);
            
            if (!eliminado) {
                throw new RpcException({
                    code: status.NOT_FOUND, 
                    message: `Usuario con ID ${data.id} no encontrado para eliminar.`
                });
            }
            
            return { success: true };
        } catch (error: any) {
            if (error instanceof RpcException) throw error;

            throw new RpcException({
                code: status.INTERNAL, // Código 13
                message: error.message || "Error interno al eliminar el usuario."
            });
        }
    }
}