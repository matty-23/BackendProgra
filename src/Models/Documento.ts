import { Componente } from './Componente.js';
import type { Types } from "mongoose";
export class Documento extends Componente {
    private estado: string;
    private version: string;

    constructor(id: Types.ObjectId, nombre: string, fechaCreacion: Date, fechaUltimaModificacion: Date, idUsuario: Types.ObjectId, estado: string, version: string) {
        super(id, nombre, fechaCreacion, fechaUltimaModificacion, idUsuario, "documento");
        this.estado = estado;
        this.version = version;
    }

    getId(): Types.ObjectId {
        return super.getId();
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
    getIdUsuario(): Types.ObjectId {
        return super.getIdUsuario();
    }

    setEstado(estado: string): void {
        this.estado = estado;
    }
    setVersion(version: string): void {
        this.version = version;
    }

    
}