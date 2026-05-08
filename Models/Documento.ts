import { Componente } from "./Componente";
export class Documento extends Componente {
    private contenido: string;
    private estado: string;
    private version: string;

    constructor(id: number, nombre: string, fechaCreacion: Date, fechaUltimaModificacion: Date, idUsuario: number, contenido: string, estado: string, version: string) {
        super(id, nombre, fechaCreacion, fechaUltimaModificacion, idUsuario, "documento");
        this.contenido = contenido;
        this.estado = estado;
        this.version = version;
    }
    
}