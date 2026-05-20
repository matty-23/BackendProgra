import { Componente} from '../Models/Componente.js';
import { Carpeta } from '../Models/Carpeta.js';
import { Documento } from '../Models/Documento.js';
export class CarpetaDto {
  readonly id?: string;
  readonly nombre!: string;
  readonly fechaCreacion?: Date;
  readonly fechaUltimaModificacion?: Date;
  readonly idUsuario!: string;
  readonly ReadMe!: string;
}