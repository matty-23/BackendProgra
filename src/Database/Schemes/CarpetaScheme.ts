import type{ ICarpetaScheme } from "../../Interfaces/ICarpetaScheme.js";
import mongoose, { Schema, type HydratedDocument } from "mongoose";

export type Carpeta = HydratedDocument<ICarpetaScheme>;

const CarpetaSchema = new Schema<ICarpetaScheme>({
    ReadMe: { type: String, default: "" }
}, {
    versionKey: false
});
export const CarpetaModel = mongoose.model<ICarpetaScheme>("Carpeta", CarpetaSchema);
