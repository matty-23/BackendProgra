import { IDocumentoService } from "../Interfaces/IDocumentoService.js";
import { DocumentoDto } from "../DTO/DocumentoDTO.js";
import { DocumentoRepository } from "../Database/Context/DocumentoRepository.js";
import { ComponenteRepository } from "../Database/Context/ComponenteRepository.js";
import { CarpetaRepository } from "../Database/Context/CarpetaRepository.js";
import { Documento } from "../Models/Documento.js";
import { Componente } from "../Models/Componente.js"
import { TransactionManager } from "../Database/TransactionManager.js";
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { UsuarioRepository } from "../Database/Context/UsuarioRepository.js";

@Injectable()
export class DocumentoService extends IDocumentoService {
    constructor(@Inject(forwardRef(() => DocumentoRepository)) private readonly _docRepo: DocumentoRepository,@Inject(forwardRef(() => CarpetaRepository)) private readonly _carpetaRepo: CarpetaRepository,@Inject(forwardRef(() => ComponenteRepository)) private readonly _componenteRepo: ComponenteRepository,@Inject(forwardRef(() => TransactionManager)) private readonly txManager: TransactionManager,@Inject(forwardRef(() => UsuarioRepository)) private readonly _usuarioRepo: UsuarioRepository) {super();}

    async getDocumentos(): Promise<Documento[]> {
        const componentes = await this._componenteRepo.obtenerTodos();
        return await this._docRepo.obtenerTodos(componentes);
    }

    async getDocumentosUsuario(idUs: string): Promise<Documento[]> {
        const componentes = await this._componenteRepo.obtenerTodos();
        const compUsuario = componentes.filter(c => c.getIdUsuario() === idUs && c.getTipo() === "documento");
        return await this._docRepo.obtenerTodos(compUsuario);
    }

    async getDocumentoById(id: string): Promise<Documento> {
        const componente = await this._componenteRepo.obtenerPorId(id.toString());
        if (!componente) throw new Error("Componente no encontrado");
        if (componente.getTipo() !== 'documento') throw new Error('El componente no pertenece a un tipo documento')
        const documento = await this._docRepo.obtenerPorId(id.toString(), componente);
        if (!documento) throw new Error("Documento no encontrado");
        return documento;
    }

    async addDocumento(documento: DocumentoDto, idCarpeta: string): Promise<Documento> {
        try {
            await this._usuarioRepo.obtenerUsuarioPorId(documento.idUsuario);
        } catch (error) {
            throw new Error("El idUsuario proporcionado no existe o no es válido.");
        }

        return await this.txManager.execute(async () => {
            const nuevoDocumento = new Documento(
                "enCreacion" + documento.idUsuario,
                documento.nombre,
                new Date(),
                new Date(),
                documento.idUsuario,
                "PENDING_UPLOAD", 
                "1.0"
            );

            const idComponente = await this._componenteRepo.crearComponente(
                nuevoDocumento.getNombre(),
                nuevoDocumento.getIdUsuario(),
                "documento" 
            );

            const idDocumento = await this._docRepo.crear(
                idComponente.toString(),
                nuevoDocumento.getEstado(),
                nuevoDocumento.getVersion()
            );

            nuevoDocumento.setId(idDocumento.toString());

            await this._carpetaRepo.añadirComponente(
                idCarpeta,
                new Componente(
                    idComponente.toString(),
                    documento.nombre,
                    new Date(),
                    new Date(),
                    documento.idUsuario,
                    "documento"
                )
            );

            return nuevoDocumento;
        });
    }

    async updateDocumento(documento: DocumentoDto): Promise<boolean> {
        if (!documento.id) {
            throw new Error("El id del documento es requerido para la actualización.");
        }
        const componenteExistente = await this._componenteRepo.obtenerPorId(documento.id.toString());
        if (!componenteExistente) {
            throw new Error("Componente no encontrado");
        }
        const documentoExistente = await this._docRepo.obtenerPorId(documento.id.toString(), componenteExistente);
        if (!documentoExistente) {
            throw new Error("Documento no encontrado");
        }
        const estadoFinal = documento.estado !== undefined ? documento.estado : documentoExistente.getEstado();
        const versionFinal = documento.version !== undefined ? documento.version : documentoExistente.getVersion();
        
        await this._componenteRepo.actualizar(
            componenteExistente.getId(),
            new Componente(documento.id, documento.nombre, componenteExistente.getFechaCreacion(), new Date(), documento.idUsuario, "documento")
        );
        await this._docRepo.actualizar(
            documento.id.toString(),
            new Documento(documento.id, documento.nombre, componenteExistente.getFechaCreacion(), new Date(), documento.idUsuario, estadoFinal, versionFinal)
        );
        return true;
    }

    async deleteDocumento(id: string): Promise<boolean> {
        const componenteExistente = await this._componenteRepo.obtenerPorId(id.toString());
        if (!componenteExistente) {
            throw new Error("Componente no encontrado");
        }
        const documentoExistente = await this._docRepo.obtenerPorId(id.toString(), componenteExistente);
        if (!documentoExistente) {
            throw new Error("Documento no encontrado");
        }
        await this._carpetaRepo.borrarComponenteEnPadre(id.toString());
        await this._docRepo.eliminar(id.toString());

        return await this._componenteRepo.eliminar(id.toString());
    }
}