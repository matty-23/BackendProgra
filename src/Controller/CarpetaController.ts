import { Controller, UseGuards, Inject } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import type { ICarpetaService } from '../Interfaces/ICarpetaService.js';
import type { IDocumentoService } from '../Interfaces/IDocumentoService.js';
import { CarpetaDto  } from '../DTO/CarpetaDTO.js';
import { Carpeta } from '../Models/Carpeta.js';
import { ComponenteDto} from '../DTO/ComponenteDTO.js';
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
                message: `Carpeta con ID ${data.id} no encontrado.`
            });
        }

        return {
            id: carpeta.getId(),
            nombre: carpeta.getNombre(),
            fechaCreacion: carpeta.getFechaCreacion(),
            fechaUltimaModificacion: carpeta.getFechaUltimaModificacion(),
            idUsuario: carpeta.getIdUsuario(),
            ReadMe: carpeta.getReadMe()
        };
    }

    @GrpcMethod('CarpetaService', 'GetComponentes')
    async getComponentes(data: { id: string }): Promise<{ componentes: ComponenteDto[] }> {
        const componentes = await this._CarpetaService.getComponentesCarpeta(data.id);
        
        if (componentes === null) {
            throw new RpcException({
                code: status.NOT_FOUND,
                message: `Carpeta con ID ${data.id} no encontrado.`
            });
        }

        const componentesDto = componentes.map(c => ({
            id: c.getId(),
            nombre: c.getNombre(),
            fechaCreacion: c.getFechaCreacion(),
            fechaUltimaModificacion: c.getFechaUltimaModificacion(),
            idUsuario: c.getIdUsuario(),
            tipo: c.getTipo()
        } as ComponenteDto));

        return { componentes: componentesDto }; 
    }

    @GrpcMethod('CarpetaService', 'Registrar')
    async registrar(data: { idPadre: string, carp: CarpetaDto }): Promise<CarpetaDto> {
        try {
            const carpeta = await this._CarpetaService.addCarpeta(data.carp, data.idPadre);
            return {
                id: carpeta.getId(),
                nombre: carpeta.getNombre(),
                fechaCreacion: carpeta.getFechaCreacion(),
                fechaUltimaModificacion: carpeta.getFechaUltimaModificacion(),
                idUsuario: carpeta.getIdUsuario(),
                ReadMe: carpeta.getReadMe()
            };
        } catch (error: any) {
            throw new RpcException({
                code: status.INVALID_ARGUMENT,
                message: error.message || "Error al registrar la Carpeta."
            });
        }
    }

    @GrpcMethod('CarpetaService', 'Actualizar')
    async actualizar(data: { id: string, doc: CarpetaDto }): Promise<{ success: boolean }> {
        try {
            const actualizado = await this._CarpetaService.updateCarpeta(
                data.id, 
                new Carpeta(data.id, data.doc.nombre, data.doc.fechaCreacion ?? new Date(), data.doc.fechaUltimaModificacion ?? new Date(), data.doc.idUsuario, data.doc.ReadMe, [])
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
                    message: `Carpeta con ID ${data.id} no encontrado para eliminar.`
                
                });
            }
            return { success: true }
        } catch (error: any) {
            if (error instanceof RpcException) throw error;

            throw new RpcException({
                code: status.INTERNAL,
                message: error.message || "Error al eliminar la carpeta"
            });
        }
    }

    @GrpcMethod('CarpetaService', 'CarpetasPrincipales')
    async getMiArea(data: { id: string }) {

        const carpetasPrincipalesMatriz = await this._CarpetaService.traerLasCarpetasPrincipales(data.id);
        const [carpetasUno] = carpetasPrincipalesMatriz; 
        if (!carpetasUno || carpetasUno.length === 0) {
            throw new RpcException({
                code: status.NOT_FOUND,
                message: `No se encontraron carpetas principales para el usuario con ID ${data.id}.`
            });
        }
        const miArea = carpetasUno[0];

        if (!miArea) {
            throw new RpcException({
                code: status.NOT_FOUND,
                message: `Carpeta 'Mi Area' no encontrada para el usuario con ID ${data.id}.`
            });
        }
        const hijosMapeados = miArea.getComponentes().map(c => ({
            id: c.getId(), 
            nombre: c.getNombre(), 
            fechaCreacion: c.getFechaCreacion()?.toString() || new Date().toString(), 
            fechaUltimaModificacion: c.getFechaUltimaModificacion()?.toString() || new Date().toString(), 
            idUsuario: data.id,
            tipo: c.getTipo()
        }));

        // En el Backend Core
return {
    listaUno: [{ 
        id: miArea.getId(),
        nombre: miArea.getNombre(),
        fechaCreacion: miArea.getFechaCreacion()?.toString() || new Date().toString(),
        fechaUltimaModificacion: miArea.getFechaUltimaModificacion()?.toString() || new Date().toString(),
        idUsuario: data.id,
        ReadMe: miArea.getReadMe(),
        componentes: hijosMapeados 
    }] 
};
        
    }}