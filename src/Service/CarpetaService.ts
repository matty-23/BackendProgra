import { ICarpetaService } from "../Interfaces/ICarpetaService.js";
import { CarpetaDto } from "../DTO/CarpetaDTO.js";
import { CarpetaRepository } from "../Database/Context/CarpetaRepository.js";
import { ComponenteRepository } from "../Database/Context/ComponenteRepository.js";
import { Carpeta } from "../Models/Carpeta.js";
import { TransactionManager } from "../Database/TransactionManager.js";
import { Componente } from "../Models/Componente.js";
import { Injectable,Inject,forwardRef } from '@nestjs/common';
import { IDocumentoService } from "../Interfaces/IDocumentoService.js";

@Injectable()
export class CarpetaService extends ICarpetaService {
    constructor(
        @Inject(forwardRef(() => CarpetaRepository)) private readonly _carpetaRepo: CarpetaRepository,
        @Inject(forwardRef(() => ComponenteRepository)) private readonly _componenteRepo: ComponenteRepository,
        @Inject(forwardRef(() => TransactionManager)) private readonly txManager: TransactionManager,
        @Inject('IDocumentoService') private readonly _documentoService: IDocumentoService
    ) {
        super();
    }

    async getCarpetasUsuario(idUsuario: string): Promise<Carpeta[]> {
        const carpetas = await this._carpetaRepo.obtenerComponentesCarpeta(idUsuario);
        return this._carpetaRepo.obtenerTodasLasCarpetasDeUnNivel(carpetas || []);
    }

    async getCarpetaById(id: string): Promise<Carpeta | null> {
        const componente = await this._componenteRepo.obtenerPorId(id.toString());
        if (!componente) return null;
        const carpeta = await this._carpetaRepo.obtenerPorId(id,componente);
        if (!carpeta) return null;
        const componentesHijos = await this._carpetaRepo.obtenerComponentesCarpeta(id);
        if (!componentesHijos) return carpeta;
        for (const c of componentesHijos) {
            if (!c) continue;
            carpeta.AñadirElemento(c);
        }
        return carpeta;
    }

    async addCarpeta(carpetaDto: CarpetaDto): Promise<Carpeta> {
        return await this.txManager.execute(async () => {
            const idComponente = await this._componenteRepo.crearComponente(carpetaDto.nombre, carpetaDto.idUsuario, "Carpeta");
            const idCarpeta = await this._carpetaRepo.crear(carpetaDto.ReadMe, idComponente.toString(), []);

            return new Carpeta(idCarpeta.toString(), carpetaDto.nombre, new Date(), new Date(), carpetaDto.idUsuario, carpetaDto.ReadMe, []);
        });

    }

    async updateCarpeta(id: string, carpetaActualizada: Carpeta): Promise<boolean> {
        const componenteExistente = await this._componenteRepo.obtenerPorId(id);
        if (!componenteExistente) return false;
        const carpetaExistente = await this._carpetaRepo.obtenerPorId(id, componenteExistente);
        if (!carpetaExistente) return false;

        componenteExistente.setNombre(carpetaActualizada.getNombre());
        await this._componenteRepo.actualizar(id, componenteExistente);
        
        const resultado = await this._carpetaRepo.actualizar(id, carpetaActualizada);
        
        return resultado !== null;
    }

    async deleteCarpeta(id: string): Promise<boolean> {
       return await this.txManager.execute(async () => {
            
            const componentesHijos = await this._carpetaRepo.obtenerComponentesCarpeta(id);
            if (componentesHijos && componentesHijos.length > 0) {
                for (const hijo of componentesHijos) {
                    if (hijo.getTipo() === "carpeta" || hijo.getTipo() === "Carpeta") {
                        await this.deleteCarpeta(hijo.getId()); // Llamada recursiva
                    }
                    if (hijo.getTipo() === "documento" || hijo.getTipo() === "Documento") {
                        await this._documentoService.deleteDocumento(hijo.getId());
                    }
                }
            }

            const componenteEliminado = await this._componenteRepo.eliminar(id);
            if (!componenteEliminado) return false;
            
            const carpetaEliminada = await this._carpetaRepo.eliminar(id);
            if (!carpetaEliminada) return false;
            
            return true;
        });
    }

    async getComponentesCarpeta(carpetaId: string): Promise<Componente[] | null> {
       const componentesCarpetas = await this._carpetaRepo.obtenerComponentesCarpeta(carpetaId);
       if (!componentesCarpetas) return null;
        return componentesCarpetas;
    }
}