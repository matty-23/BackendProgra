import { Types } from 'mongoose';
export interface IComponenteScheme {
    _id: Types.ObjectId;
    nombre: string;
    fechaCreacion: Date;
    fechaUltimaModificacion: Date;
    idUsuario: Types.ObjectId;
    tipo: string;
}//Estoy dejando esta interfaz solo para tener los dos metodos,con y sin interfaz, pero este es un paso salteable.