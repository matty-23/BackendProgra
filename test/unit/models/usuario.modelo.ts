import { Usuario } from "../../../src/Models/Usuario";
import { UsuarioDto } from "../../../src/DTO/UsuarioDTO"
export const modelosUsuarios = {

    documentoUsuario1: new Usuario(
        'usuario-1',
        'Maira',
        'Troillan',
        'maira.troillan@example.com',
        'MairaTr',
        '12345'
    ),

    documentoUsuario2: new Usuario(
        'usuario-2',
        'Maira',
        'Troillan',
        'maira.troillan@example.com',
        'MairaTr',
        '12345'
    ),

}

export const modelosUsuariosDto = {
        id: 'usuario-2',
        nombre: 'Maira',
        apellido: 'Troillan',
        email: 'maira.troillan@example.com',
        username: 'MairaTr',
        password: '12345'
    } as UsuarioDto