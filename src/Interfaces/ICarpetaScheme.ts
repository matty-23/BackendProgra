import type { Types } from "mongoose";

export interface ICarpetaScheme {
    id: number;
    nombre: string;
    fechaCreacion: Date;
    fechaUltimaModificacion: Date;
    idUsuario: number;
    idPadre: Types.ObjectId | null;
    ReadMe: string;
}