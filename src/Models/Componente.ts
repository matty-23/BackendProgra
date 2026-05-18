
export class Componente {
    private id: string; 
    private nombre: string;
    private fechaCreacion: Date;
    private fechaUltimaModificacion: Date
    private idUsuario: string;
    private tipo: string;

    constructor(id: string, nombre: string, fechaCreacion: Date, fechaUltimaModificacion: Date, idUsuario: string, tipo: string) {
        this.id = id,
        this.nombre = nombre,
        this.fechaCreacion = fechaCreacion,
        this.fechaUltimaModificacion = fechaUltimaModificacion,
        this.idUsuario = idUsuario,
        this.tipo = tipo
    }

    public getId(): string {
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
    public getIdUsuario(): string {
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
    public setId(id: string): void {
        this.id = id;
    }
    public setIdUsuario(idUsuario: string): void {
        this.idUsuario = idUsuario;
    }

}