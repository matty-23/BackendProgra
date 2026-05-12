import {Types} from "mongoose";
export interface IDocumentoScheme {
    id: number;
    nombre: string;
    fechaCreacion: Date;
    fechaUltimaModificacion: Date;
    idUsuario: number;
    contenido: string;
    estado: string;
    version: string;
    idPadre: Types.ObjectId | null;
   }