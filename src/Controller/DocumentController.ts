import { Controller, Inject, UseGuards } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { IDocumentoService } from '../Interfaces/IDocumentoService.js';
import { DocumentoDto } from '../DTO/DocumentoDTO.js';
import { JwtGrpcAuthGuard } from '../Guards/JwtAuthGuard.js';

interface EmptyResponse {success: boolean;}

@Controller()
@UseGuards(JwtGrpcAuthGuard)
export class DocumentoController {

    constructor(@Inject('IDocumentoService') private readonly _documentoService: IDocumentoService) { }

    @GrpcMethod('DocumentoService', 'GetAll')
    async getAll(data: any): Promise<{ documentos: DocumentoDto[] }> {
        const Documentos = await this._documentoService.getDocumentos();

        const DocumentosDto = Documentos.map(c => ({
            id: c.getId(),
            nombre: c.getNombre(),
            fechaCreacion: c.getFechaCreacion()?.toISOString(), 
            fechaUltimaModificacion: c.getFechaUltimaModificacion()?.toISOString(),
            idUsuario: c.getIdUsuario(),
            estado: c.getEstado(),
            version: c.getVersion()
        } as unknown as DocumentoDto));

        return { documentos: DocumentosDto };
    }

    @GrpcMethod('DocumentoService', 'GetById')
    async getById(data: { id: string }): Promise<DocumentoDto> {
        const Documento = await this._documentoService.getDocumentoById(data.id);

        if (!Documento) {throw new RpcException({ code: 5, message: `Documento con ID ${data.id} no encontrado.` });}

        return {
            id: Documento.getId(),
            nombre: Documento.getNombre(),
            fechaCreacion: Documento.getFechaCreacion()?.toISOString(), // [A3]
            fechaUltimaModificacion: Documento.getFechaUltimaModificacion()?.toISOString(),
            idUsuario: Documento.getIdUsuario(),
            estado: Documento.getEstado(),
            version: Documento.getVersion()
        } as unknown as DocumentoDto;
    }

    @GrpcMethod('DocumentoService', 'Registrar')
    async registrar(data: { idCarpeta: string, doc: DocumentoDto }): Promise<DocumentoDto> {
        const Documento = await this._documentoService.addDocumento(data.doc, data.idCarpeta);
        
        if (!Documento) {
            throw new RpcException({ code: 3, message: "Error al registrar el Documento." });
        }

        return {
            id: Documento.getId(),
            nombre: Documento.getNombre(),
            fechaCreacion: Documento.getFechaCreacion()?.toISOString(), 
            fechaUltimaModificacion: Documento.getFechaUltimaModificacion()?.toISOString(),
            idUsuario: Documento.getIdUsuario(),
            estado: Documento.getEstado(),
            version: Documento.getVersion()
        } as unknown as DocumentoDto;
    }

    @GrpcMethod('DocumentoService', 'Actualizar')
    async actualizar(data: { id: string, doc: DocumentoDto }): Promise<EmptyResponse> {
        const actualizado = await this._documentoService.updateDocumento({ ...data.doc, id: data.id });
        
        if (!actualizado) {
            throw new RpcException({ code: 5, message: `Documento con ID ${data.id} no encontrado para actualizar.` });
        }

        return { success: true };
    }

    @GrpcMethod('DocumentoService', 'Eliminar')
    async eliminar(data: { id: string }): Promise<EmptyResponse> {
        const eliminado = await this._documentoService.deleteDocumento(data.id);
        
        if (!eliminado) {
            throw new RpcException({ code: 5, message: `Documento con ID ${data.id} no encontrado para eliminar.` });
        }

        return { success: true };
    }
}