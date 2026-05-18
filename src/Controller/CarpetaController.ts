import type { ICarpetaService } from '../Interfaces/ICarpetaService.js';
import type { IDocumentoService } from '../Interfaces/IDocumentoService.js';
import { Controller, Get, Param, NotFoundException, Post, Body, BadRequestException, HttpCode, Put, Delete } from '@nestjs/common';
import { CarpetaDto } from '../DTO/CarpetaDTO.js';
import { DocumentoDto } from '../DTO/DocumentoDTO.js';
import { ComponenteDto } from '../DTO/ComponenteDTO.js';
import { Inject } from '@nestjs/common';

@Controller('api/Carpetas')
export class CarpetaController {

    constructor(@Inject('ICarpetaService') private readonly _CarpetaService: ICarpetaService, @Inject('IDocumentoService') private readonly _DocumentoService: IDocumentoService) { }
    
    //Preguntar al profe si es necesario este endpoint, ya que mucho sentido de ser no tiene
    /* @Get()
    async getAll(): Promise<CarpetaDto[]> {
        const carpetas = await this._CarpetaService.getCarpetas();

        const carpetasDto = carpetas.map(c => ({
            id: c.getId(),
            nombre: c.getNombre(),
            fechaCreacion: c.getFechaCreacion(),
            fechaUltimaModificacion: c.getFechaUltimaModificacion(),
            idUsuario: c.getIdUsuario(),
            ReadMe: c.getReadMe()
        } as CarpetaDto));

        return carpetasDto;
    } */

    @Get(':id')
    async getById(@Param('id') id: string): Promise<CarpetaDto> {
        const carpeta = await this._CarpetaService.getCarpetaById(id);
        const componentes = await this._CarpetaService.getComponentesCarpeta(id);

        if (!carpeta) {
            throw new NotFoundException(`Carpeta con ID ${id} no encontrado.`);
        }

        const carpetaDto: CarpetaDto = {
            id: carpeta.getId(),
            nombre: carpeta.getNombre(),
            fechaCreacion: carpeta.getFechaCreacion(),
            fechaUltimaModificacion: carpeta.getFechaUltimaModificacion(),
            idUsuario: carpeta.getIdUsuario(),
            ReadMe: carpeta.getReadMe()
        };

        return carpetaDto;
    }

    @Get(':id/hijos')
    async getComponentes(@Param('id') id: string): Promise<ComponenteDto[]> {
        const componentes = await this._CarpetaService.getComponentesCarpeta(id);
        if (componentes === null) {// Si no se encuentran componentes, no deberia tirar ningun error, simplemente carga vacia
            throw new NotFoundException(`Carpeta con ID ${id} no encontrado.`);
        }

        const componentesDto = componentes.map(c => ({
            id: c.getId(),
            nombre: c.getNombre(),
            fechaCreacion: c.getFechaCreacion(),
            fechaUltimaModificacion: c.getFechaUltimaModificacion(),
            idUsuario: c.getIdUsuario(),
            tipo: c.getTipo()
        } as ComponenteDto));

        return componentesDto;
    }

    @Post()
    @HttpCode(201)
    async registrar(@Body() carp: CarpetaDto): Promise<CarpetaDto> {

        const carpeta = await this._CarpetaService.addCarpeta(carp);
        if (!carpeta) {
            throw new BadRequestException("Error al registrar el Carpeta.");
        }

        const carpetaDto: CarpetaDto = {
            id: carpeta.getId(),
            nombre: carpeta.getNombre(),
            fechaCreacion: carpeta.getFechaCreacion(),
            fechaUltimaModificacion: carpeta.getFechaUltimaModificacion(),
            idUsuario: carpeta.getIdUsuario(),
            ReadMe: carpeta.getReadMe()
        };
        return carpetaDto;
    }

    @Put(':id')
    async actualizar(@Param('id') id: string, @Body() doc: CarpetaDto): Promise<void> {
        const actualizado = await this._CarpetaService.updateCarpeta({ ...doc, id });
        if (!actualizado) {
            throw new NotFoundException(`Carpeta con ID ${id} no encontrado para actualizar.`);
        }
    }

    @Delete(':id')
    async eliminar(@Param('id') id: string): Promise<void> {
        const eliminado = await this._CarpetaService.deleteCarpeta(id);
        if (!eliminado) {
            throw new NotFoundException(`Carpeta con ID ${id} no encontrado para eliminar.`);
        }
    }


}