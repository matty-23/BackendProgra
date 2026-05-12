import type{ ICarpetaScheme } from "../../Interfaces/ICarpetaScheme.js";
import mongoose, { Schema, type HydratedDocument } from "mongoose";

export type Carpeta = HydratedDocument<ICarpetaScheme>;

const CarpetaSchema = new Schema<ICarpetaScheme>({
    _id: { type: Schema.Types.ObjectId, required: true, unique: true },
    ReadMe: { type: String, default: "" },
    componentes: [{ type: Schema.Types.ObjectId, ref: "Componente" }]
}, {
    versionKey: false
});
export const CarpetaModel = mongoose.model<ICarpetaScheme>("Carpeta", CarpetaSchema);
