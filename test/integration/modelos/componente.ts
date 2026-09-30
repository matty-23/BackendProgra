import { Componente } from "../../../src/Models/Componente";
import { Types } from "mongoose";
export const mockId = new Types.ObjectId().toString();

export const mockComponente = new Componente(
    mockId,
    "Carpeta de Universidad",
    new Date(),
    new Date(),
    "user123",
    "carpeta"
);

export const mockCarpetaMongo = {
    _id: new Types.ObjectId(mockId),
    ReadMe: "Contenido del archivo ReadMe",
    componentes: []
};

export const payloadUpdate = {
        id: mockId,
        carp: {
            nombre: "Carpeta Actualizada",
            idUsuario: "user123",
            ReadMe: "Readme modificado",
            fechaCreacion: new Date(),
            fechaUltimaModificacion: new Date(),
            componentes: []
        }
    };
