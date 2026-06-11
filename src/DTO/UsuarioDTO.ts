export class UsuarioDto {
  readonly id!: string;
  readonly nombre!: string;
  readonly apellido?: string;
  readonly email!: string;
  readonly fechaCreacion?: string;
  readonly username!: string;
  readonly password?: string;
}