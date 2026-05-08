import { Componente } from "./Componente";

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
    
    AñadirElemento(componente: Componente): void {
        this.componentes.push(componente);
    }
    

}