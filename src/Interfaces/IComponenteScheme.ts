import { Types} from 'mongoose';
export interface IComponenteScheme {
    id: number;
    nombre: string;
    fechaCreacion: Date;
    fechaUltimaModificacion: Date;
    idUsuario: number;
    tipo: string;
    idtipoComponente: Types.ObjectId;
}