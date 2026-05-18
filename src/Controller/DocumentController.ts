import { IDocumentoService } from '../Interfaces/IDocumentoService.js';
import { Controller, Get, Param, NotFoundException, Post, Body, BadRequestException, HttpCode, Put, Delete,Inject } from '@nestjs/common';
import { DocumentoDto } from '../DTO/DocumentoDTO.js';
import { Documento } from '../Models/Documento.js';

@Controller('Documentos')
export class DocumentoController {

    constructor(@Inject('IDocumentoService') private readonly _documentoService: IDocumentoService) { }

    @Get()
    async getAll(): Promise<DocumentoDto[]> {
        const Documentos = await this._documentoService.getDocumentos();

        const DocumentosDto = Documentos.map(c => ({
            id: c.getId(),
            nombre: c.getNombre(),
            fechaCreacion: c.getFechaCreacion(),
            fechaUltimaModificacion: c.getFechaUltimaModificacion(),
            idUsuario: c.getIdUsuario(),
            estado: c.getEstado(),
            version: c.getVersion()
        } as DocumentoDto));

        return DocumentosDto;
    }

    @Get(':id')
    async getById(@Param('id') id: string): Promise<DocumentoDto> {
        const Documento = await this._documentoService.getDocumentoById(id);

        if (!Documento) {
            throw new NotFoundException(`Documento con ID ${id} no encontrado.`);
        }

        const DocumentoDto: DocumentoDto = {
            id: Documento.getId(),
            nombre: Documento.getNombre(),
            fechaCreacion: Documento.getFechaCreacion(),
            fechaUltimaModificacion: Documento.getFechaUltimaModificacion(),
            idUsuario: Documento.getIdUsuario(),
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
            estado: Documento.getEstado(),
            version: Documento.getVersion()
        };
        return DocumentoDto;
    }

    @Put(':id')
    async actualizar(@Param('id') id: string, @Body() doc: DocumentoDto): Promise<void> {
        const actualizado = await this._documentoService.updateDocumento({ ...doc, id: id });
        if (!actualizado) {
            throw new NotFoundException(`Documento con ID ${id} no encontrado para actualizar.`);
        }
    }

    @Delete(':id')
    async eliminar(@Param('id') id: string): Promise<void> {
        const eliminado = await this._documentoService.deleteDocumento(id);
        if (!eliminado) {
            throw new NotFoundException(`Documento con ID ${id} no encontrado para eliminar.`);
        }
    }

}