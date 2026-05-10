export interface IDocumentoScheme {
    id: number;
    nombre: string;
    fechaCreacion: Date;
    fechaUltimaModificacion: Date;
    idUsuario: number;
    contenido: string;
    estado: string;
    version: string;
}