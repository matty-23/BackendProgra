import type { ICarpetaService } from '../Interfaces/ICarpetaService.js';
import type { IDocumentoService } from '../Interfaces/IDocumentoService.js';
import { Controller, Get, Param, NotFoundException, Post, Body, BadRequestException, HttpCode, Put, Delete } from '@nestjs/common';
import { CarpetaDto } from '../DTO/CarpetaDTO.js';
import { DocumentoDto } from '../DTO/DocumentoDTO.js';
import { Carpeta } from '../Models/Carpeta.js';
import { Documento } from '../Models/Documento.js';

@Controller('api/Carpetas')
export class CarpetaController {

    constructor(private readonly _CarpetaService: ICarpetaService, private readonly _DocumentoService: IDocumentoService) { }

    @Get()
    async getAll(): Promise<CarpetaDto[]> {
        const carpetas = await this._CarpetaService.getCarpetas();

        const carpetasDto = carpetas.map(c => ({
            id: c.getId(),
            nombre: c.getNombre(),
            fechaCreacion: c.getFechaCreacion(),
            fechaUltimaModificacion: c.getFechaUltimaModificacion(),
            idUsuario: c.getIdUsuario(),
            idPadre: c.getIdPadre(),
            ReadMe: c.getReadMe()
        } as CarpetaDto));

        return carpetasDto;
    }

    @Get(':id')
    async getById(@Param('id') id: string): Promise<CarpetaDto> {
        const idCarp = parseInt(id, 10);
        const carpeta = await this._CarpetaService.getCarpetaById(idCarp);
        const componentes = await this._CarpetaService.getComponentesCarpeta(idCarp)

        if (!carpeta) {
            throw new NotFoundException(`Carpeta con ID ${idCarp} no encontrado.`);
        }

        const carpetaDto: CarpetaDto = {
            id: carpeta.getId(),
            nombre: carpeta.getNombre(),
            fechaCreacion: carpeta.getFechaCreacion(),
            fechaUltimaModificacion: carpeta.getFechaUltimaModificacion(),
            idUsuario: carpeta.getIdUsuario(),
            idPadre: carpeta.getIdPadre()?.toString() ?? null,
            ReadMe: carpeta.getReadMe()
        };

        return carpetaDto;
    }

    @Post()
    @HttpCode(201)
    async registrar(@Body() carp: CarpetaDto): Promise<CarpetaDto> {

        const carpeta = await this._CarpetaService.addCarpeta(carp);
        if (!carpeta) {
            throw new BadRequestException("Error al registrar el Carpeta.");
        }
        const componentes = await this._CarpetaService.getComponentesCarpeta(carp.id)
        const carpetaDto: CarpetaDto = {
            id: carpeta.getId(),
            nombre: carpeta.getNombre(),
            fechaCreacion: carpeta.getFechaCreacion(),
            fechaUltimaModificacion: carpeta.getFechaUltimaModificacion(),
            idUsuario: carpeta.getIdUsuario(),
            idPadre: carpeta.getIdPadre()?.toString() ?? null,
            ReadMe: carpeta.getReadMe()
        };
        return carpetaDto;
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
    async getComponentes(@Param('id') id: string): Promise<(CarpetaDto | Documento)[]> {
        const idDoc = parseInt(id, 10);
        return await this._CarpetaService.getComponentesCarpeta(idDoc);
    }
}