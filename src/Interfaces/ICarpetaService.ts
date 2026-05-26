import { Carpeta } from '../Models/Carpeta.js'; 
import { CarpetaDto } from '../DTO/CarpetaDTO.js';
import { DocumentoDto } from '../DTO/DocumentoDTO.js';
import type { Documento } from '../Models/Documento.js';
import type { Componente } from '../Models/Componente.js';
export abstract class ICarpetaService {
    abstract getCarpetasUsuario(idUsuario: string): Promise<Carpeta[]>;
    abstract getCarpetaById(id: string): Promise<Carpeta| null>;
    abstract addCarpeta(Carpeta: CarpetaDto,idPadre?:string): Promise<Carpeta>;
    abstract updateCarpeta(id: string, carpetaActualizada: Carpeta): Promise<boolean>;
    abstract deleteCarpeta(id: string): Promise<boolean>;
    abstract getComponentesCarpeta(id: string): Promise<Componente[] | null>;
}