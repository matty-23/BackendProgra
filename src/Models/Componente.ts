import type { Types } from "mongoose";
export class Componente {
    private id: number; 
    private nombre: string;
    private fechaCreacion: Date;
    private fechaUltimaModificacion: Date
    private idUsuario: number;
    private tipo: string;

    constructor(id: number, nombre: string, fechaCreacion: Date, fechaUltimaModificacion: Date, idUsuario: number, tipo: string) {
        this.id = id,
        this.nombre = nombre,
        this.fechaCreacion = fechaCreacion,
        this.fechaUltimaModificacion = fechaUltimaModificacion,
        this.idUsuario = idUsuario,
        this.tipo = tipo
    }

    public getId(): number {
        return this.id;
    }
    protected getNombre(): string {
        return this.nombre;
    }
    protected getFechaCreacion(): Date {
        return this.fechaCreacion;
    }
    protected getFechaUltimaModificacion(): Date {
        return this.fechaUltimaModificacion;
    }
    protected getIdUsuario(): number {
        return this.idUsuario;
    }
    getTipo(): string {
        return this.tipo;
    }
    protected setNombre(nombre: string): void {
        this.nombre = nombre;
    }
    protected setFechaUltimaModificacion(fechaUltimaModificacion: Date): void {
        this.fechaUltimaModificacion = fechaUltimaModificacion;
    }

}