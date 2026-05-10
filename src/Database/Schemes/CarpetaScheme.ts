import type{ ICarpetaScheme } from "../../Interfaces/ICarpetaScheme.js";
import mongoose, { Schema, type HydratedDocument } from "mongoose";

export type DocumentoDocument = HydratedDocument<ICarpetaScheme>;

const FileSchema = new Schema<ICarpetaScheme>({
    id: { type: Number, required: true, unique: true },
    nombre: { type: String, required: true },

    fechaCreacion: { type: Date, default: Date.now },
    fechaUltimaModificacion: { type: Date, default: Date.now },

    idUsuario: { type: Number, required: true },
    tipo: { type: String},     
    idPadre: { type: Number},
    ReadMe: { type: String, default: "" }



}, {
    versionKey: false
});
export const CarpetaModel = mongoose.model<ICarpetaScheme>("Carpeta", FileSchema);
