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
    getId(): string {
        return super.getId();
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

    AñadirElemento(componente: Componente): void {
        this.componentes.push(componente);
        console.log(`Elemento ${componente.getNombre()} añadido a la carpeta ${this.getNombre()}`);
    }

    EliminarElemento(id: string): void {
        this.componentes = this.componentes.filter(c => c.getId() !== id);
    }

setComponentes(componentes: Componente[]): void {
        this.componentes = componentes;
    }

}