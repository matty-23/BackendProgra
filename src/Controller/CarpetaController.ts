import { Controller, UseGuards, Inject } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import type { ICarpetaService } from '../Interfaces/ICarpetaService.js';
import type { IDocumentoService } from '../Interfaces/IDocumentoService.js';
import { CarpetaDto } from '../DTO/CarpetaDTO.js';
import { Carpeta } from '../Models/Carpeta.js';
import { ComponenteDto } from '../DTO/ComponenteDTO.js';
import { JwtGrpcAuthGuard } from '../Guards/JwtAuthGuard.js';

@Controller()
@UseGuards(JwtGrpcAuthGuard)
export class CarpetaController {

    constructor(@Inject('ICarpetaService') private readonly _CarpetaService: ICarpetaService,@Inject('IDocumentoService') private readonly _DocumentoService: IDocumentoService) { }

    @GrpcMethod('CarpetaService', 'GetById')
    async getById(data: { id: string }): Promise<CarpetaDto> {
        const carpeta = await this._CarpetaService.getCarpetaById(data.id);
        
        if (!carpeta) {
            throw new RpcException({
                code: status.NOT_FOUND,
                message: `Carpeta con ID ${data.id} no encontrada.`
            });
        }

        return {
            id: carpeta.getId(),
            nombre: carpeta.getNombre(),
            fechaCreacion: carpeta.getFechaCreacion()?.toISOString(), // [A2]
            fechaUltimaModificacion: carpeta.getFechaUltimaModificacion()?.toISOString(),
            idUsuario: carpeta.getIdUsuario(),
            ReadMe: carpeta.getReadMe()
        } as unknown as CarpetaDto;
    }

    @GrpcMethod('CarpetaService', 'GetComponentes')
    async getComponentes(data: { id: string }): Promise<{ componentes: ComponenteDto[] }> {
        const componentes = await this._CarpetaService.getComponentesCarpeta(data.id);
        
        if (componentes === null) {
            throw new RpcException({
                code: status.NOT_FOUND,
                message: `Carpeta con ID ${data.id} no encontrada.`
            });
        }

        const componentesDto = componentes.map(c => ({
            id: c.getId(),
            nombre: c.getNombre(),
            fechaCreacion: c.getFechaCreacion()?.toISOString(), // [A2]
            fechaUltimaModificacion: c.getFechaUltimaModificacion()?.toISOString(),
            idUsuario: c.getIdUsuario(),
            tipo: c.getTipo()
        } as unknown as ComponenteDto));

        return { componentes: componentesDto }; 
    }

    @GrpcMethod('CarpetaService', 'Registrar')
    async registrar(data: { idPadre: string, carp: CarpetaDto }): Promise<CarpetaDto> {
        try {
            const carpeta = await this._CarpetaService.addCarpeta(data.carp, data.idPadre);
            return {
                id: carpeta.getId(),
                nombre: carpeta.getNombre(),
                fechaCreacion: carpeta.getFechaCreacion()?.toISOString(), // [A2]
                fechaUltimaModificacion: carpeta.getFechaUltimaModificacion()?.toISOString(),
                idUsuario: carpeta.getIdUsuario(),
                ReadMe: carpeta.getReadMe()
            } as unknown as CarpetaDto;
        } catch (error: any) {
            throw new RpcException({
                code: status.INVALID_ARGUMENT,
                message: error.message || "Error al registrar la Carpeta."
            });
        }
    }

    @GrpcMethod('CarpetaService', 'Actualizar')
    async actualizar(data: { id: string, carp: CarpetaDto }): Promise<{ success: boolean }> {
        try {
            const actualizado = await this._CarpetaService.updateCarpeta(
                data.id, 
                new Carpeta(
                    data.id, 
                    data.carp.nombre, 
                    data.carp.fechaCreacion ? new Date(data.carp.fechaCreacion) : new Date(), 
                    data.carp.fechaUltimaModificacion ? new Date(data.carp.fechaUltimaModificacion) : new Date(), 
                    data.carp.idUsuario, 
                    data.carp.ReadMe, 
                    []
                )
            );

            if (!actualizado) {
                throw new RpcException({
                    code: status.NOT_FOUND,
                    message: `Carpeta con ID ${data.id} no encontrada para actualizar.`
                });
            }
            return { success: true }; 
        } catch (error: any) {
            if (error instanceof RpcException) throw error;
            
            throw new RpcException({
                code: status.INVALID_ARGUMENT,
                message: error.message || "Error al actualizar la Carpeta."
            });
        }
    }

    @GrpcMethod('CarpetaService', 'Eliminar')
    async eliminar(data: { id: string }): Promise<{ success: boolean }> {
        try {
            const eliminado = await this._CarpetaService.deleteCarpeta(data.id);
            if (!eliminado) {
                throw new RpcException({
                    code: status.NOT_FOUND,
                    message: `Carpeta con ID ${data.id} no encontrada para eliminar.`
                });
            }
            return { success: true };
        } catch (error: any) {
            if (error instanceof RpcException) throw error;

            throw new RpcException({
                code: status.INTERNAL,
                message: error.message || "Error al eliminar la carpeta"
            });
        }
    }

    @GrpcMethod('CarpetaService', 'CarpetasPrincipales')
    async getCarpetasPrincipales(data: { id: string }): Promise<{ carpetasPrincipales: any[] }> { 
        const carpetasPrincipales = await this._CarpetaService.traerLasCarpetasPrincipales(data.id);
        
        if (!carpetasPrincipales || carpetasPrincipales.length === 0) {
            throw new RpcException({
                code: status.NOT_FOUND,
                message: `No se encontraron carpetas principales para el usuario con ID ${data.id}.`
            });
        }

        const carpetasMapeadas = carpetasPrincipales.map(carpeta => {
            const componentesMapeados = carpeta.getComponentes().map(c => ({
                id: c.getId(), 
                nombre: c.getNombre(), 
                fechaCreacion: c.getFechaCreacion()?.toISOString() || new Date().toISOString(), 
                fechaUltimaModificacion: c.getFechaUltimaModificacion()?.toISOString() || new Date().toISOString(), 
                idUsuario: c.getIdUsuario() || data.id,
                ReadMe: typeof (c as any).getReadMe === 'function' ? (c as any).getReadMe() : "",
                tipo: c.getTipo() || "Componente",
                componentes: []
            }));

            return {
                id: carpeta.getId(),
                nombre: carpeta.getNombre(),
                fechaCreacion: carpeta.getFechaCreacion()?.toISOString() || new Date().toISOString(),
                fechaUltimaModificacion: carpeta.getFechaUltimaModificacion()?.toISOString() || new Date().toISOString(),
                idUsuario: data.id,
                ReadMe: carpeta.getReadMe() || "",
                tipo: "Carpeta", 
                componentes: componentesMapeados 
            };
        });

        return { carpetasPrincipales: carpetasMapeadas };
    }
}