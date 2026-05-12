import mongoose, { Schema, type HydratedDocument } from "mongoose";
export const UsuarioModel =  mongoose.model("Usuario", new Schema({
    _id: { type: Schema.Types.ObjectId, required: true, unique: true },
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    idCarpetaRaiz: { type: Schema.Types.ObjectId, required: true, unique: true },
    fechaCreacion: { type: Date, default: Date.now }
}, {
    versionKey: false
}));