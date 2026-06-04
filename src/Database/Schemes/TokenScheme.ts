import mongoose, { Schema, type HydratedDocument, Types } from "mongoose";
import type { ITokenScheme } from "../../Interfaces/ITokenScheme.js";

export type RefreshTokenDocument = HydratedDocument<ITokenScheme>;

const RefreshTokenSchema = new Schema<ITokenScheme>({
    _id: { type: Schema.Types.ObjectId, required: true, unique: true },
    token: { type: String, required: true, unique: true },
    idUsuario: { type: Schema.Types.ObjectId, required: true, ref: 'Usuario' },
    expiresAt: { type: Date, required: true }
}, {
    versionKey: false
});

RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshTokenModel = mongoose.model<ITokenScheme>("RefreshToken", RefreshTokenSchema);