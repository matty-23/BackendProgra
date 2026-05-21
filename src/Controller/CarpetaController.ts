import type { ICarpetaService } from '../Interfaces/ICarpetaService.js';
import type { IDocumentoService } from '../Interfaces/IDocumentoService.js';
import { Controller, Get, Param, NotFoundException, Post, Body, BadRequestException, HttpCode, Put, Delete } from '@nestjs/common';
import { CarpetaDto } from '../DTO/CarpetaDTO.js';
import { Carpeta } from '../Models/Carpeta.js';
import { ComponenteDto } from '../DTO/ComponenteDTO.js';
import { Inject } from '@nestjs/common';

@Controller('api/Carpetas')
export class CarpetaController {

    constructor(@Inject('ICarpetaService') private readonly _CarpetaService: ICarpetaService, @Inject('IDocumentoService') private readonly _DocumentoService: IDocumentoService) { }

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
        if (componentes === null) {
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

    @Post(':idPadre')
    @HttpCode(201)
    async registrar(@Body() carp: CarpetaDto, @Param('idPadre') idPadre: string): Promise<CarpetaDto> {

        try {
            const carpeta = await this._CarpetaService.addCarpeta(carp, idPadre);
            const carpetaDto: CarpetaDto = {
                id: carpeta.getId(),
                nombre: carpeta.getNombre(),
                fechaCreacion: carpeta.getFechaCreacion(),
                fechaUltimaModificacion: carpeta.getFechaUltimaModificacion(),
                idUsuario: carpeta.getIdUsuario(),
                ReadMe: carpeta.getReadMe()
            };
            return carpetaDto;

        } catch (error: any) {
            throw new BadRequestException(error.message || "Error al registrar la Carpeta.");
        }
    }



    @Put(':id')
    async actualizar(@Param('id') id: string, @Body() doc: CarpetaDto): Promise<void> {
        try {
            const actualizado = await this._CarpetaService.updateCarpeta(id, new Carpeta(id, doc.nombre, doc.fechaCreacion ?? new Date(), doc.fechaUltimaModificacion ?? new Date(), doc.idUsuario, doc.ReadMe, []));
            
            if (!actualizado) throw new NotFoundException(`Carpeta con ID ${id} no encontrada para actualizar.`);
            
        } catch (error: any) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(error.message || "Error al actualizar la Carpeta.");
        }
    }

    @Delete(':id')
    async eliminar(@Param('id') id: string): Promise<void> {
        try {
            const eliminado = await this._CarpetaService.deleteCarpeta(id);
            if (!eliminado) {
                throw new NotFoundException(`Carpeta con ID ${id} no encontrado para eliminar.`);
            }
        } catch (error: any) {
            throw new BadRequestException(error.message || "Error al eliminar la carpeta");
        }
    }


}