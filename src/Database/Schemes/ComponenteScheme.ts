import type{ IComponenteScheme} from "../../Interfaces/IComponenteScheme.js";
import mongoose, { Schema, type HydratedDocument } from "mongoose";

export type Componente = HydratedDocument<IComponenteScheme>;

const ComponenteSchema = new Schema<IComponenteScheme>({
    id: { type: Number, required: true, unique: true },
    nombre: { type: String, required: true },

    fechaCreacion: { type: Date, default: Date.now },
    fechaUltimaModificacion: { type: Date, default: Date.now },

    idUsuario: { type: Number, required: true },
    tipo: { type: String},
    idPadre: { type: Schema.Types.ObjectId, ref: 'Carpeta', default: null },
    idtipoComponente: { type: Schema.Types.ObjectId, required: true }
}, {
    versionKey: false
});
export const ComponenteModel = mongoose.model<IComponenteScheme>("Componente", ComponenteSchema);
