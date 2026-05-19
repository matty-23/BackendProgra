import type { UsuarioDto } from "../DTO/UsuarioDTO.js";
import type { Usuario } from "../Models/Usuario.js";

export interface IUsuarioService {
    getUsuarioById(id: string): Promise<Usuario | null>;
    getUsuarioByUsername(username: string): Promise<Usuario | null>;
    addUsuario(usuario: UsuarioDto): Promise<Usuario>;
    updateUsuario(usuario: UsuarioDto): Promise<boolean>;
    deleteUsuario(id: string): Promise<boolean>;
}