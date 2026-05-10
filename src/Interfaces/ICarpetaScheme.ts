import type { Types } from "mongoose";

export interface ICarpetaScheme {
    idPadre?: Types.ObjectId | null;
    ReadMe: string;
}