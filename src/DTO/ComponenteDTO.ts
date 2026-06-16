export class ComponenteDto {
    readonly id!: string;
    readonly nombre!: string;
    readonly fechaCreacion!: Date;
    readonly fechaUltimaModificacion!: Date;
    readonly idUsuario!: string;
    readonly tipo!: string;
}
export class ComponenteDtoGRPC {
    readonly id!: string;
    readonly nombre!: string;
    readonly fechaCreacion!: string;
    readonly fechaUltimaModificacion!: string;
    readonly idUsuario!: string;
    readonly tipo!: string;
}