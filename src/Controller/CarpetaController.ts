import type { ICarpetaService } from '../Interfaces/ICarpetaService.js';
import type { IDocumentoService } from '../Interfaces/IDocumentoService.js';
import { Controller, Get, Param, NotFoundException, Post, Body,BadRequestException, HttpCode, Put, Delete  } from '@nestjs/common';
import { CarpetaDto } from '../DTO/CarpetaDTO.js';
import { DocumentoDto } from '../DTO/DocumentDTO.js';

@Controller('api/Carpetas')
export class CarpetaController {

    constructor(private readonly _CarpetaService: ICarpetaService, private readonly _DocumentoService: IDocumentoService) { }

    @Get()
    async getAll(): Promise<CarpetaDto[]> {
        const Carpetas = await this._CarpetaService.getCarpetas();
        return Carpetas;
    }
    
    @Get(':id')
    async getById(@Param('id') id: string): Promise<CarpetaDto> {
        const idDoc = parseInt(id, 10);
        const Carpeta = await this._CarpetaService.getCarpetaById(idDoc);
        if (!Carpeta) {
            throw new NotFoundException(`Carpeta con ID ${idDoc} no encontrado.`);
        }
        return Carpeta;
    }

    @Post()
    @HttpCode(201)
    async registrar(@Body() doc: CarpetaDto): Promise<CarpetaDto> {
        
        const Carpeta = await this._CarpetaService.addCarpeta(doc);
        if (!Carpeta) {
            throw new BadRequestException("Error al registrar el Carpeta.");
        }
        return Carpeta;
    }

    @Put(':id')
    async actualizar(@Param('id') id: string, @Body() doc: CarpetaDto): Promise<void> {
        const idDoc = parseInt(id, 10);
        const actualizado = await this._CarpetaService.updateCarpeta({ ...doc, id: idDoc });
        if (!actualizado) {
            throw new NotFoundException(`Carpeta con ID ${idDoc} no encontrado para actualizar.`);
        }
    }

    @Delete(':id')
    async eliminar(@Param('id') id: string): Promise<void> {
        const idDoc = parseInt(id, 10);
        const eliminado = await this._CarpetaService.deleteCarpeta(idDoc);
        if (!eliminado) {
            throw new NotFoundException(`Carpeta con ID ${idDoc} no encontrado para eliminar.`);
        }
    }

    @Get(':id/componentes')
    async getComponentes(@Param('id') id: string): Promise<(CarpetaDto | DocumentoDto)[]> {
        const idDoc = parseInt(id, 10);
        return await this._CarpetaService.getComponentesCarpeta(idDoc);
    }
}