import { Documento } from '../Models/Documento.js'; 
import { DocumentoDto } from '../DTO/DocumentDTO.js';
export abstract class IDocumentoService {
    abstract getDocumentos(): Promise<DocumentoDto[]>;
    abstract getDocumentoById(id: number): Promise<DocumentoDto>;
    abstract addDocumento(Documento: DocumentoDto): Promise<DocumentoDto>;
    abstract updateDocumento(Documento: DocumentoDto): Promise<boolean>;
    abstract deleteDocumento(id: number): Promise<boolean>;
}