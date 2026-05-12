import { ICarpetaService } from "../Interfaces/ICarpetaService.js";
import { CarpetaDto } from "../DTO/CarpetaDTO.js";
import { CarpetaRepository } from "../Database/Context/CarpetaRepository.js";
import { ComponenteRepository } from "../Database/Context/ComponenteRepository.js";
import { Carpeta } from "../Models/Carpeta.js";
import { Documento } from "../Models/Documento.js";
import { Componente } from "../Models/Componente.js";
import mongoose from "mongoose";

export class CarpetaService extends ICarpetaService {
    private _carpetaRepo = new CarpetaRepository();
    private _componenteRepo = new ComponenteRepository();  

    async getCarpetas(): Promise<Carpeta[]> {
        return await this._carpetaRepo.obtenerTodos();
    }

    async getCarpetaById(id: number): Promise<Carpeta> {
        const carpeta = await this._carpetaRepo.obtenerPorId(id);
        if (!carpeta) {
            throw new Error("Carpeta no encontrada");
        }
        return carpeta;
    }

    async addCarpeta(carpetaDto: CarpetaDto): Promise<Carpeta> {
        const nuevaCarpeta = new Carpeta(
            carpetaDto.id,
            carpetaDto.nombre,
            new Date(),
            new Date(),
            carpetaDto.idUsuario,
            carpetaDto.idPadre ? new mongoose.Types.ObjectId(carpetaDto.idPadre) : null,
            carpetaDto.ReadMe
        );

        const componente = new Componente(
            carpetaDto.id,
            carpetaDto.nombre,
            nuevaCarpeta.getFechaCreacion(),
            nuevaCarpeta.getFechaUltimaModificacion(),
            carpetaDto.idUsuario,
            nuevaCarpeta.getIdPadre(),
            "carpeta"
        );

        await this._componenteRepo.crearComponenteCarpeta(componente, nuevaCarpeta);
        return nuevaCarpeta;
    }

    async updateCarpeta(carpetaDto: CarpetaDto): Promise<boolean> {
        const resultado = await this._carpetaRepo.actualizar(carpetaDto.id, {
            nombre: carpetaDto.nombre,
            ReadMe: carpetaDto.ReadMe,
            idPadre: carpetaDto.idPadre ? new mongoose.Types.ObjectId(carpetaDto.idPadre) : null
        });
        
        return resultado !== null;
    }

    async deleteCarpeta(id: number): Promise<boolean> {
        return await this._carpetaRepo.eliminar(id);
    }

    async getComponentesCarpeta(carpetaId: number): Promise<(Carpeta | Documento)[]> {
        const idComponente =
        const carpetaDoc = await this._carpetaRepo.obtenerPorId(carpetaId);
        if (!carpetaDoc) throw new Error("Carpeta no encontrada");

        throw new Error("Lógica de filtrado de componentes hijos pendiente de definir en Repository");
    }
}