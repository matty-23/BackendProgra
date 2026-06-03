import { Injectable } from "@nestjs/common";
import { RefreshTokenModel } from "../Schemes/TokenScheme.js"; 
import { Types } from "mongoose";

@Injectable()
export class TokenRepository {

    async guardar(token: string, idUsuario: string, expiresInDays: number): Promise<void> {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + expiresInDays);

        const nuevoToken = new RefreshTokenModel({ 
            _id: new Types.ObjectId(),
            token: token,
            idUsuario: new Types.ObjectId(idUsuario),
            expiresAt: expiresAt
        });

        await nuevoToken.save();
    }

    async obtenerPorToken(token: string) {
        return await RefreshTokenModel.findOne({ token }).lean().exec();
    }

    async eliminarPorToken(token: string): Promise<void> {
        await RefreshTokenModel.deleteOne({ token }).exec();
    }

    async eliminarTodosDelUsuario(idUsuario: string): Promise<void> {
        await RefreshTokenModel.deleteMany({ idUsuario: new Types.ObjectId(idUsuario) }).exec();
    }
}