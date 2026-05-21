import { ICarpetaService } from "../Interfaces/ICarpetaService.js";
import { CarpetaDto } from "../DTO/CarpetaDTO.js";
import { CarpetaRepository } from "../Database/Context/CarpetaRepository.js";
import { ComponenteRepository } from "../Database/Context/ComponenteRepository.js";
import { Carpeta } from "../Models/Carpeta.js";
import { TransactionManager } from "../Database/TransactionManager.js";
import { Componente } from "../Models/Componente.js";
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { IDocumentoService } from "../Interfaces/IDocumentoService.js";
import { UsuarioRepository } from "../Database/Context/UsuarioRepository.js";

@Injectable()
export class CarpetaService extends ICarpetaService {
    constructor(
        @Inject(forwardRef(() => CarpetaRepository)) private readonly _carpetaRepo: CarpetaRepository,
        @Inject(forwardRef(() => ComponenteRepository)) private readonly _componenteRepo: ComponenteRepository,
        @Inject(forwardRef(() => TransactionManager)) private readonly txManager: TransactionManager,
        @Inject('IDocumentoService') private readonly _documentoService: IDocumentoService,
        @Inject(forwardRef(() => UsuarioRepository)) private readonly _usuarioRepo: UsuarioRepository
    ) {
        super();
    }

    async getCarpetasUsuario(idUsuario: string): Promise<Carpeta[]> {
        const componentes = await this._componenteRepo.obtenerComponentesPorTipo("Carpeta");
        const componentesDelUsuario = componentes.filter(c => c.getIdUsuario() === idUsuario);

        return await this._carpetaRepo.obtenerTodasLasCarpetasDeUnNivel(componentesDelUsuario);
    }

    async getCarpetaById(id: string): Promise<Carpeta | null> {
        const componente = await this._componenteRepo.obtenerPorId(id.toString());
        if (!componente) return null;
        const carpeta = await this._carpetaRepo.obtenerPorId(id, componente);
        if (!carpeta) return null;
        const componentesHijos = await this._carpetaRepo.obtenerComponentesCarpeta(id);
        if (!componentesHijos) return carpeta;
        for (const c of componentesHijos) {
            if (!c) continue;
            carpeta.AñadirElemento(c);
        }
        return carpeta;
    }

    async addCarpeta(carpetaDto: CarpetaDto, idPadre?: string): Promise<Carpeta> {
        try {
            await this._usuarioRepo.obtenerUsuarioPorId(carpetaDto.idUsuario);
        } catch (error) {
            throw new Error("El idUsuario proporcionado no existe o no es válido.");
        }
        return await this.txManager.execute(async () => {
            const idComponente = await this._componenteRepo.crearComponente(carpetaDto.nombre, carpetaDto.idUsuario, "Carpeta");
            const idCarpeta = await this._carpetaRepo.crear(carpetaDto.ReadMe, idComponente.toString(), []);
            const nuevaCarpeta = new Carpeta(idCarpeta.toString(), carpetaDto.nombre, new Date(), new Date(), carpetaDto.idUsuario, carpetaDto.ReadMe, []);
            if (idPadre) {
                const padre = await this.getCarpetaById(idPadre);
                if (!padre) {
                    throw new Error("La carpeta padre especificada en la ruta no existe.");
                }

                padre.AñadirElemento(nuevaCarpeta);

                const actualizado = await this.updateCarpeta(padre.getId(), padre);
                if (!actualizado) {
                    throw new Error("Error al actualizar la carpeta padre.");
                }
            }
            return nuevaCarpeta;
        });

    }

    async updateCarpeta(id: string, carpetaActualizada: Carpeta): Promise<boolean> {
        const componenteExistente = await this._componenteRepo.obtenerPorId(id);
        if (!componenteExistente) return false;
        const carpetaExistente = await this._carpetaRepo.obtenerPorId(id, componenteExistente);
        if (!carpetaExistente) return false;

        try {
            await this._usuarioRepo.obtenerUsuarioPorId(carpetaActualizada.getIdUsuario());
        } catch (error) {
            throw new Error("El idUsuario proporcionado para la actualización no existe o no es válido.");
        }

        componenteExistente.setNombre(carpetaActualizada.getNombre());
        await this._componenteRepo.actualizar(id, componenteExistente);

        const resultado = await this._carpetaRepo.actualizar(id, carpetaActualizada);

        return resultado !== null;
    }

    async deleteCarpeta(id: string): Promise<boolean> {
        return await this.txManager.execute(async () => {

            const componentesHijos = await this._carpetaRepo.obtenerComponentesCarpeta(id);
            if (componentesHijos && componentesHijos.length > 0) {
                for (const hijo of componentesHijos) {
                    if (hijo.getTipo() === "carpeta" || hijo.getTipo() === "Carpeta") {
                        const hijoBorrado = await this.deleteCarpeta(hijo.getId());
                        if (!hijoBorrado) throw new Error(`Error al borrar la subcarpeta ${hijo.getId()}`); // Verificar resultado
                    }
                    if (hijo.getTipo() === "documento" || hijo.getTipo() === "Documento") {
                        const docBorrado = await this._documentoService.deleteDocumento(hijo.getId());
                        if (!docBorrado) throw new Error(`Error al borrar el documento ${hijo.getId()}`); // Verificar resultado
                    }
                }
            }

            const componenteEliminado = await this._componenteRepo.eliminar(id);
            if (!componenteEliminado) throw new Error(`No se pudo eliminar el componente ${id}`);

            const carpetaEliminada = await this._carpetaRepo.eliminar(id);
            if (!carpetaEliminada) throw new Error(`No se pudo eliminar la carpeta ${id}`);

            return true;
        });
    }

    async getComponentesCarpeta(carpetaId: string): Promise<Componente[] | null> {
        const componentesCarpetas = await this._carpetaRepo.obtenerComponentesCarpeta(carpetaId);
        if (!componentesCarpetas) return null;
        return componentesCarpetas;
    }
}