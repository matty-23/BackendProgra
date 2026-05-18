import { Componente } from './Componente.js';
export class Documento extends Componente {
    private estado: string;
    private version: string;

    constructor(id: string, nombre: string, fechaCreacion: Date, fechaUltimaModificacion: Date, idUsuario: string, estado: string, version: string) {
        super(id, nombre, fechaCreacion, fechaUltimaModificacion, idUsuario, "documento");
        this.estado = estado;
        this.version = version;
    }

    getId(): string {
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
    getIdUsuario(): string {
        return super.getIdUsuario();
    }

    setEstado(estado: string): void {
        this.estado = estado;
    }
    setVersion(version: string): void {
        this.version = version;
    }
    setId(id: string): void {
        super.setId(id);
    }
}