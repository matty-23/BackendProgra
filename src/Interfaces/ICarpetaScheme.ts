import type { Types } from "mongoose";

export interface ICarpetaScheme {
    _id: Types.ObjectId;
    ReadMe: string;
    componentes: Types.ObjectId[]; // Referencias a los componentes hijos (pueden ser documentos o carpetas)
}//Comprobar si hace falta añadir el tipo