import { Types } from 'mongoose';
export interface IComponenteScheme {
    id: number;
    nombre: string;
    fechaCreacion: Date;
    fechaUltimaModificacion: Date;
    idUsuario: number;
    tipo: string;
    idPadre: Types.ObjectId | null;
    idtipoComponente: Types.ObjectId;
}