
export class DocumentoDto {
  readonly id!: string;
  readonly nombre!: string;
  readonly fechaCreacion!: Date;
  readonly fechaUltimaModificacion!: Date;
  readonly idUsuario!: string;
  readonly estado!: string;
  readonly version!: string;
}