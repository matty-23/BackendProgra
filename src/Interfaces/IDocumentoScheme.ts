export interface IDocumentoScheme {
    id: number;
    nombre: string;
    fechaCreacion: Date;
    fechaUltimaModificacion: Date;
    idUsuario: number;
    tipo: string;
    contenido: string;
    estado: string;
    version: string;
}