import type {IDocumentoScheme} from "../../Interfaces/IDocumentoScheme.js";
import mongoose, { Schema, type HydratedDocument } from "mongoose";

export type DocumentoDocument = HydratedDocument<IDocumentoScheme>;

const FileSchema = new Schema<IDocumentoScheme>({
    id: { type: Number, required: true, unique: true },
 nombre: { type: String, required: true },

 fechaCreacion: { type: Date, default: Date.now },
 fechaUltimaModificacion: { type: Date, default: Date.now },

idUsuario: { type: Number, required: true }, 
tipo: { type: String, default: "documento" },
contenido: { type: String, default: "" },
estado: { type: String, default: "borrador"},

 version: {type: String,default: "1.0"}

}, {
 timestamps: true
});

export const FileModel =
 mongoose.model<IDocumentoScheme>("File", FileSchema);