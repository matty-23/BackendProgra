import type { IDocumentoService } from '../Interfaces/IDocumentoService.js';
import { Controller, Get, Param, NotFoundException, Post, Body, BadRequestException, HttpCode, Put, Delete } from '@nestjs/common';
import { DocumentoDto } from '../DTO/DocumentoDTO.js';
import { Documento } from '../Models/Documento.js';

@Controller('api/Documentos')
export class DocumentoController {

    constructor(private readonly _documentoService: IDocumentoService) { }

    @Get()
    async getAll(): Promise<DocumentoDto[]> {
        const Documentos = await this._documentoService.getDocumentos();

        const DocumentosDto = Documentos.map(c => ({
            id: c.getId(),
            nombre: c.getNombre(),
            fechaCreacion: c.getFechaCreacion(),
            fechaUltimaModificacion: c.getFechaUltimaModificacion(),
            idUsuario: c.getIdUsuario(),
            idPadre: c.getIdPadre(),
            contenido: c.getContenido(),
            estado: c.getEstado(),
            version: c.getVersion()
        } as DocumentoDto));

        return DocumentosDto;
    }

    @Get(':id')
    async getById(@Param('id') id: string): Promise<DocumentoDto> {
        const idDoc = parseInt(id, 10);
        const Documento = await this._documentoService.getDocumentoById(idDoc);

        if (!Documento) {
            throw new NotFoundException(`Documento con ID ${idDoc} no encontrado.`);
        }

        const DocumentoDto: DocumentoDto = {
            id: Documento.getId(),
            nombre: Documento.getNombre(),
            fechaCreacion: Documento.getFechaCreacion(),
            fechaUltimaModificacion: Documento.getFechaUltimaModificacion(),
            idUsuario: Documento.getIdUsuario(),
            contenido: Documento.getContenido(),
            estado: Documento.getEstado(),
            version: Documento.getVersion()
        };

        return DocumentoDto;
    }

    @Post()
    @HttpCode(201)
    async registrar(@Body() carp: DocumentoDto): Promise<DocumentoDto> {

        const Documento = await this._documentoService.addDocumento(carp);
        if (!Documento) {
            throw new BadRequestException("Error al registrar el Documento.");
        }

        const DocumentoDto: DocumentoDto = {
            id: Documento.getId(),
            nombre: Documento.getNombre(),
            fechaCreacion: Documento.getFechaCreacion(),
            fechaUltimaModificacion: Documento.getFechaUltimaModificacion(),
            idUsuario: Documento.getIdUsuario(),
            contenido: Documento.getContenido(),
            estado: Documento.getEstado(),
            version: Documento.getVersion()
        };
        return DocumentoDto;
    }

    @Put(':id')
    async actualizar(@Param('id') id: string, @Body() doc: DocumentoDto): Promise<void> {
        const idDoc = parseInt(id, 10);
        const actualizado = await this._documentoService.updateDocumento({ ...doc, id: idDoc });
        if (!actualizado) {
            throw new NotFoundException(`Documento con ID ${idDoc} no encontrado para actualizar.`);
        }
    }

    @Delete(':id')
    async eliminar(@Param('id') id: string): Promise<void> {
        const idDoc = parseInt(id, 10);
        const eliminado = await this._documentoService.deleteDocumento(idDoc);
        if (!eliminado) {
            throw new NotFoundException(`Documento con ID ${idDoc} no encontrado para eliminar.`);
        }
    }

}