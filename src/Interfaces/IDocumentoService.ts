import { Documento } from '../Models/Documento.js'; 
import { DocumentoDto } from '../DTO/DocumentoDTO.js';
export abstract class IDocumentoService {
    abstract getDocumentos(): Promise<Documento[]>;
    abstract getDocumentoById(id: number): Promise<Documento>;
    abstract addDocumento(Documento: DocumentoDto): Promise<Documento>;
    abstract updateDocumento(Documento: DocumentoDto): Promise<boolean>;
    abstract deleteDocumento(id: number): Promise<boolean>;
}