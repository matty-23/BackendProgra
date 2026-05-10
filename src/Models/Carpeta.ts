import { Componente } from "./Componente.js";

export class Carpeta extends Componente {

    private componentes: Componente[];
    private idPadre: number;
    private ReadMe: string;
    private ruta: string;

    constructor(id: number, nombre: string, fechaCreacion: Date, fechaUltimaModificacion: Date, idUsuario: number, idPadre: number, ReadMe: string, ruta: string) {
        super(id, nombre, fechaCreacion, fechaUltimaModificacion, idUsuario, "carpeta");
        this.componentes = [];
        this.idPadre = idPadre;
        this.ReadMe = ReadMe;
        this.ruta = ruta;
    }

    getComponentes(): Componente[] {
        return this.componentes;
    }
    getIdPadre(): number {
        return this.idPadre;
    }
    getReadMe(): string {
        return this.ReadMe;
    }
    getRuta(): string {
        return this.ruta;
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