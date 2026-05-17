import { IDocumentoService } from "../Interfaces/IDocumentoService.js";
import { DocumentoDto } from "../DTO/DocumentoDTO.js";
import { DocumentoRepository } from "../Database/Context/DocumentoRepository.js";
import { ComponenteRepository } from "../Database/Context/ComponenteRepository.js";
import { Documento } from "../Models/Documento.js";
import { Componente } from "../Models/Componente.js"
import mongoose, { mongo } from "mongoose";

export class DocumentoService extends IDocumentoService {
    private _documentoRepo = new DocumentoRepository();
    private _componenteRepo = new ComponenteRepository();
    async getDocumentos(): Promise<Documento[]> {
        const componentes = await this._componenteRepo.obtenerTodos();
        return await this._documentoRepo.obtenerTodos(componentes);
    }
    async getDocumentoById(id: string): Promise<Documento> {
        const componente = await this._componenteRepo.obtenerPorId(id.toString());
        if (!componente) throw new Error("Componente no encontrado");
        const documento = await this._documentoRepo.obtenerPorId(id.toString(), componente);
        if (!documento) throw new Error("Documento no encontrado");
        return documento;
    }
    async addDocumento(documento: DocumentoDto): Promise<Documento> {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const nuevoDocumento = new Documento(
                documento.id,
                documento.nombre,
                new Date(),
                new Date(),
                documento.idUsuario,
                documento.estado,
                documento.version,
            );
            const idComponente = await this._componenteRepo.crearComponente(nuevoDocumento.getNombre(), nuevoDocumento.getIdUsuario(), nuevoDocumento.getTipo());
            const idDocumento = await this._documentoRepo.crear(idComponente.toString(), nuevoDocumento.getEstado(), nuevoDocumento.getVersion());
            nuevoDocumento.setId(idDocumento.toString());
            return nuevoDocumento;
        }
        catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        } finally {
            session.endSession();
        }
    }
    async updateDocumento(documento: DocumentoDto): Promise<boolean> {
        const componenteExistente = await this._componenteRepo.obtenerPorId(documento.id.toString());
        if (!componenteExistente) {
            throw new Error("Componente no encontrado");
        }
        const documentoExistente = await this._documentoRepo.obtenerPorId(documento.id.toString(), componenteExistente);
        if (!documentoExistente) {
            throw new Error("Documento no encontrado");
        }
        this._componenteRepo.actualizar(componenteExistente.getId(), new Componente(documento.id, documento.nombre, documento.fechaCreacion, documento.fechaUltimaModificacion, documento.idUsuario, "documento"));
        this._documentoRepo.actualizar(documento.id.toString(), new Documento(documento.id, documento.nombre, documento.fechaCreacion, documento.fechaUltimaModificacion, documento.idUsuario, documento.estado, documento.version));
        return true;
    }
    async deleteDocumento(id: string): Promise<boolean> {
        const componenteExistente = await this._componenteRepo.obtenerPorId(id.toString());
        if (!componenteExistente) {
            throw new Error("Componente no encontrado");
        }
        const documentoExistente = await this._documentoRepo.obtenerPorId(id.toString(), componenteExistente);
        if (!documentoExistente) {
            throw new Error("Documento no encontrado");
        }
        await this._documentoRepo.eliminar(id.toString());
        return await this._componenteRepo.eliminar(id.toString());
    }

}