import { Componente } from "./Componente.js";


export class Carpeta extends Componente {
    private componentes: Componente[];
    private ReadMe: string;
    private ruta: string;

    constructor(_id: string, nombre: string, fechaCreacion: Date, fechaUltimaModificacion: Date, idUsuario: string, ReadMe: string, componentes? : Componente[]) {
        super(_id, nombre, fechaCreacion, fechaUltimaModificacion, idUsuario, "carpeta");
        this.componentes = componentes || [];
        this.ReadMe = ReadMe;
        this.ruta = "";
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
    getComponentes(): Componente[] {
        return this.componentes;
    }
    getReadMe(): string {
        return this.ReadMe;
    }
    getRuta(): string {
        return this.ruta;
    }
    setReadMe(ReadMe: string): void {
        this.ReadMe = ReadMe;
    }

    /* setRutaHijo(ruta: string): void {
        const carpetas = this.componentes.filter(c => c.getTipo() == "carpeta") as Carpeta[];
        for (const carpeta of carpetas) {
            carpeta.setRutaHijo(ruta + "/" + this.getNombre());
        }
        this.ruta = ruta + "/" + this.getNombre();
    } */

    AñadirElemento(componente: Componente): void {
        this.componentes.push(componente);
    }

    EliminarElemento(id: string): void {
        this.componentes = this.componentes.filter(c => c.getId() == id);
    }



}