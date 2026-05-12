import { Componente } from './Componente.js';
import type { Types } from "mongoose";
export class Documento extends Componente {
    private contenido: string;
    private estado: string;
    private version: string;

    constructor(id: number, nombre: string, fechaCreacion: Date, fechaUltimaModificacion: Date, idUsuario: number, contenido: string, estado: string, version: string, idPadre: Types.ObjectId | null) {
        super(id, nombre, fechaCreacion, fechaUltimaModificacion, idUsuario, idPadre, "documento");
        this.contenido = contenido;
        this.estado = estado;
        this.version = version;
    }
    getContenido(): string {
        return this.contenido;
    }
    getId(): number {
        return super.getId();
    }

    getIdPadre(): Types.ObjectId | null {
        return super.getIdPadre();
    }
    getEstado(): string {
        return this.estado;
    }
    getVersion(): string {
        return this.version;
    }
    getNombre(): string {
        return super.getNombre();
    }
    getFechaCreacion(): Date {
        return super.getFechaCreacion();
    }
    getFechaUltimaModificacion(): Date {
        return super.getFechaUltimaModificacion();
    }
    getIdUsuario(): number {
        return super.getIdUsuario();
    }
    setContenido(contenido: string): void {
        this.contenido = contenido;
    }
    setEstado(estado: string): void {
        this.estado = estado;
    }
    setVersion(version: string): void {
        this.version = version;
    }

    
}