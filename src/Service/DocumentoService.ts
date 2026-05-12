import { IDocumentoService } from "../Interfaces/IDocumentoService.js";
import { DocumentoDto } from "../DTO/DocumentoDTO.js";
import { DocumentoRepository } from "../Database/Context/DocumentoRepository.js";
import { ComponenteRepository } from "../Database/Context/ComponenteRepository.js";
import { Documento } from "../Models/Documento.js";
import {Componente} from "../Models/Componente.js"

export class DocumentoService extends IDocumentoService {
    private _documentoRepo = new DocumentoRepository();
    private _componenteRepo = new ComponenteRepository();
    async getDocumentos(): Promise<Documento[]> {
        return await this._documentoRepo.obtenerTodos();
    }
    async getDocumentoById(id: number): Promise<Documento> {
        const doc = await this._documentoRepo.obtenerPorId(id);
        if (!doc) {
            throw new Error("Documento no encontrado");
        }
        return doc;
    }
    async addDocumento(documento: DocumentoDto): Promise<Documento> {
               const nuevaDocumento = new Documento(
                   documento.id,
                   documento.nombre,
                   new Date(),
                   new Date(),
                   documento.idUsuario,
                   documento.contenido,
                   documento.estado,
                   documento.version,
                   documento.
               );
       
               const componente = new Componente(
                   documento.id,
                   documento.nombre,
                   nuevaDocumento.getFechaCreacion(),
                   nuevaDocumento.getFechaUltimaModificacion(),
                   documento.idUsuario,
                   nuevaDocumento.getIdPadre(),
                   "documento"
               );
       
               await this._componenteRepo.crearComponenteDocumento(componente, nuevaDocumento);
               return nuevaDocumento;
    }
    async updateDocumento(documento: DocumentoDto): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async deleteDocumento(id: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

}