import { Componente } from "./Componente.js";

export class Carpeta extends Componente {

    private componentes: Componente[];
    private idPadre: number;
    private ReadMe: string;
    
    constructor(id: number, nombre: string, fechaCreacion: Date, fechaUltimaModificacion: Date, idUsuario: number, idPadre: number, ReadMe: string) {
        super(id, nombre, fechaCreacion, fechaUltimaModificacion, idUsuario, "carpeta");
        this.componentes = [];
        this.idPadre = idPadre;
        this.ReadMe = ReadMe;
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
    
    AñadirElemento(componente: Componente): void {
        this.componentes.push(componente);
    }
    
    EliminarElemento(id: number): void {
        this.componentes = this.componentes.filter(c => c.getId() == id);
    }

    

}