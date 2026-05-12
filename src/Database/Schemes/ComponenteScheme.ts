import type{ IComponenteScheme} from "../../Interfaces/IComponenteScheme.js";
import mongoose, { Schema, type HydratedDocument } from "mongoose";

//Hace lo contrario de lean(). Convierte un modelo a un documento con propiedades para guardar, etc.
export type Componente = HydratedDocument<IComponenteScheme>;

const ComponenteSchema = new Schema<IComponenteScheme>({
    _id: { type: Schema.Types.ObjectId, required: true, unique: true },
    nombre: { type: String, required: true },

    fechaCreacion: { type: Date, default: Date.now },
    fechaUltimaModificacion: { type: Date, default: Date.now },

    idUsuario: { type: Schema.Types.ObjectId, required: true },
    tipo: { type: String}
}, {
    versionKey: false
});

//Al modelo le pasas la <"forma"> del documento, el nombre de la coleccion y el esquema a usar
export const ComponenteModel = mongoose.model<IComponenteScheme>("Componente", ComponenteSchema);
