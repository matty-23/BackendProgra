import { Carpeta } from '../Models/Carpeta.js'; 
import { CarpetaDto } from '../DTO/CarpetaDTO.js';
import { DocumentoDto } from '../DTO/DocumentoDTO.js';
import type { Documento } from '../Models/Documento.js';
export abstract class ICarpetaService {
    abstract getCarpetas(): Promise<Carpeta[]>;
    abstract getCarpetaById(id: number): Promise<Carpeta>;
    abstract addCarpeta(Carpeta: CarpetaDto): Promise<Carpeta>;
    abstract updateCarpeta(Carpeta: CarpetaDto): Promise<boolean>;
    abstract deleteCarpeta(id: number): Promise<boolean>;
    abstract getComponentesCarpeta(id: number): Promise<(Carpeta | Documento)[]>;
}