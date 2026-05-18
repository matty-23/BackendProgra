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

    async getCarpetasUsuario(idUsuario: string): Promise<Carpeta[]> {
        const carpetas = await this._carpetaRepo.obtenerComponentesCarpeta(idUsuario);
        return this._carpetaRepo.obtenerTodasLasCarpetasDeUnNivel(carpetas || []);
    }

    async getCarpetaById(id: string): Promise<Carpeta> {
        const componente = await this._componenteRepo.obtenerPorId(id.toString());
        if (!componente) {
            throw new Error("Componente no encontrado");
        }
        const carpeta = await this._carpetaRepo.obtenerPorId(id,componente);
        if (!carpeta) {
            throw new Error("Carpeta no encontrada");
        }
        const componentesHijos = await this._carpetaRepo.obtenerComponentesCarpeta(id);
        if (!componentesHijos) return carpeta;
        for (const c of componentesHijos) {
            if (!c) continue;
            carpeta.AñadirElemento(c);
        }
        return carpeta;
    }

    async addCarpeta(carpetaDto: CarpetaDto): Promise<Carpeta> {
        const session = await mongoose.startSession();
        session.startTransaction();
        try { 
            const idComponente = await this._componenteRepo.crearComponente(carpetaDto.nombre, carpetaDto.idUsuario, "Carpeta", session);
            const idCarpeta = await this._carpetaRepo.crear(carpetaDto.ReadMe,idComponente.toString(),[]);
            await session.commitTransaction();
            return new Carpeta(idCarpeta.toString(), carpetaDto.nombre, new Date(), new Date(), carpetaDto.idUsuario, carpetaDto.ReadMe, []);
        
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }finally {
            session.endSession();
        }

    }

    async updateCarpeta(carpetaDto: CarpetaDto): Promise<boolean> {
        if (!carpetaDto.id) {
            throw new Error("ID de carpeta es requerido para actualizar");
        }
        const componenteExistente = await this._componenteRepo.obtenerPorId(carpetaDto.id);
        if (!componenteExistente) {
            throw new Error("Componente no encontrado");
        }
        const carpetaExistente = await this._carpetaRepo.obtenerPorId(carpetaDto.id, componenteExistente);
        if (!carpetaExistente) {
            throw new Error("Carpeta no encontrada");
        }
        const resultado = await this._carpetaRepo.actualizar(carpetaDto.id, carpetaExistente);
        
        return resultado !== null;
    }

    async deleteCarpeta(id: string): Promise<boolean> {
        return await this._carpetaRepo.eliminar(id);
    }

    async getComponentesCarpeta(carpetaId: string): Promise<Componente[]> {
       const componentesCarpetas = await this._carpetaRepo.obtenerComponentesCarpeta(carpetaId);
       if (!componentesCarpetas) {
        throw new Error("Carpeta no encontrada");
       }
        return componentesCarpetas;
    }
}