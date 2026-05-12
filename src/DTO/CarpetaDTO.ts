import { DocumentoDto } from './DocumentoDTO.js';
import { Carpeta } from '../Models/Carpeta.js';
import { Documento } from '../Models/Documento.js';
export class CarpetaDto {
  readonly id!: number;
  readonly nombre!: string;
  readonly fechaCreacion!: Date;
  readonly fechaUltimaModificacion!: Date;
  readonly idUsuario!: number;
  readonly idPadre!: string | null ;
  readonly ReadMe!: string;
}