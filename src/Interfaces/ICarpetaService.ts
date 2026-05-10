import { Carpeta } from '../Models/Carpeta.js'; 
import { CarpetaDto } from '../DTO/CarpetaDTO.js';
import { DocumentoDto } from '../DTO/DocumentDTO.js';
export abstract class ICarpetaService {
    abstract getCarpetas(): Promise<CarpetaDto[]>;
    abstract getCarpetaById(id: number): Promise<CarpetaDto>;
    abstract addCarpeta(Carpeta: CarpetaDto): Promise<CarpetaDto>;
    abstract updateCarpeta(Carpeta: CarpetaDto): Promise<boolean>;
    abstract deleteCarpeta(id: number): Promise<boolean>;
    abstract getComponentesCarpeta(id: number): Promise<(CarpetaDto | DocumentoDto)[]>;
}