import { Carpeta } from '../Models/Carpeta.js'; 
import { CarpetaDto } from '../DTO/CarpetaDTO.js';
import { DocumentoDto } from '../DTO/DocumentoDTO.js';
import type { Documento } from '../Models/Documento.js';
export abstract class ICarpetaService {
    abstract getCarpetasUsuario(idUsuario: string): Promise<Carpeta[]>;
    abstract getCarpetaById(id: string): Promise<Carpeta>;
    abstract addCarpeta(Carpeta: CarpetaDto): Promise<Carpeta>;
    abstract updateCarpeta(Carpeta: CarpetaDto): Promise<boolean>;
    abstract deleteCarpeta(id: string): Promise<boolean>;
    abstract getComponentesCarpeta(id: string): Promise<(Carpeta | Documento)[]>;
}