import type { Types } from "mongoose";
export class Componente {
    private id: Types.ObjectId; 
    private nombre: string;
    private fechaCreacion: Date;
    private fechaUltimaModificacion: Date
    private idUsuario: Types.ObjectId;
    private tipo: string;

    constructor(id: Types.ObjectId, nombre: string, fechaCreacion: Date, fechaUltimaModificacion: Date, idUsuario: Types.ObjectId, tipo: string) {
        this.id = id,
        this.nombre = nombre,
        this.fechaCreacion = fechaCreacion,
        this.fechaUltimaModificacion = fechaUltimaModificacion,
        this.idUsuario = idUsuario,
        this.tipo = tipo
    }

    public getId(): Types.ObjectId {
        return this.id;
    }
    public getNombre(): string {
        return this.nombre;
    }
    public getFechaCreacion(): Date {
        return this.fechaCreacion;
    }
    public getFechaUltimaModificacion(): Date {
        return this.fechaUltimaModificacion;
    }
    public getIdUsuario(): Types.ObjectId {
        return this.idUsuario;
    }
    public getTipo(): string {
        return this.tipo;
    }
    public setNombre(nombre: string): void {
        this.nombre = nombre;
    }
    public setFechaUltimaModificacion(fechaUltimaModificacion: Date): void {
        this.fechaUltimaModificacion = fechaUltimaModificacion;
    }

}