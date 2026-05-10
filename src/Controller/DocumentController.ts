import type { IDocumentoService } from '../Interfaces/IDocumentoService.js';
import { Controller, Get, Param, NotFoundException, Post, Body,BadRequestException, HttpCode, Put, Delete  } from '@nestjs/common';
import { DocumentoDto } from '../DTO/DocumentDTO.js';

@Controller('api/documentos')
export class DocumentoController {

    constructor(private readonly _documentoService: IDocumentoService) { }

    @Get()
    async getAll(): Promise<DocumentoDto[]> {
        const Documentos = await this._documentoService.getDocumentos();
        return Documentos;
    }
    
    @Get(':id')
    async getById(@Param('id') id: string): Promise<DocumentoDto> {
        const idDoc = parseInt(id, 10);
        const documento = await this._documentoService.getDocumentoById(idDoc);
        if (!documento) {
            throw new NotFoundException(`Documento con ID ${idDoc} no encontrado.`);
        }
        return documento;
    }

    @Post()
    @HttpCode(201)
    async registrar(@Body() doc: DocumentoDto): Promise<DocumentoDto> {
        
        const documento = await this._documentoService.addDocumento(doc);
        if (!documento) {
            throw new BadRequestException("Error al registrar el documento.");
        }
        return documento;
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



