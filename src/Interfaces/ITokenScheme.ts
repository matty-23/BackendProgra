import { Types } from 'mongoose';

export interface ITokenScheme {
    _id: Types.ObjectId;
    token: string;
    idUsuario: Types.ObjectId;
    expiresAt: Date;
}