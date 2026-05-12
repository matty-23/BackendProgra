import { setUncaughtExceptionCaptureCallback } from "process";
import { Componente } from "./Componente.js";
import type { Types } from "mongoose";


export class Carpeta extends Componente {
    private componentes: Componente[];
    private ReadMe: string;
    private ruta: string;

    constructor(_id: number, nombre: string, fechaCreacion: Date, fechaUltimaModificacion: Date, idUsuario: number, ReadMe: string) {
        super(_id, nombre, fechaCreacion, fechaUltimaModificacion, idUsuario, "carpeta");
        this.componentes = [];
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

    getIdUsuario(): number {
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

    EliminarElemento(id: number): void {
        this.componentes = this.componentes.filter(c => c.getId() == id);
    }



}