import type { IDocumentoScheme } from "../../Interfaces/IDocumentoScheme.js";
import mongoose, { Schema, type HydratedDocument } from "mongoose";
import { Types } from "mongoose";

export type DocumentoDocument = HydratedDocument<IDocumentoScheme>;

const FileSchema = new Schema<IDocumentoScheme>({
    _id: { type: Types.ObjectId },
    estado: { type: String },
    version: { type: String, default: "1.0" }

}, {
    versionKey: false
});
export const DocumentoModel = mongoose.model<IDocumentoScheme>("Documento", FileSchema);