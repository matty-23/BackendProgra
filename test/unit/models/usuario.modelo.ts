import { Usuario } from "../../../src/Models/Usuario";
import { UsuarioDto } from "../../../src/DTO/UsuarioDTO"
import { Types, } from 'mongoose';

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
    fechaCreacion: new Date().toISOString(),
} as UsuarioDto

export const modelosUsuariosDto2 = {
    id: 'usuario-3',
    nombre: 'Maira',
    apellido: 'Troillan',
    email: 'maira.troillan@example.com',
    username: 'MairaTr',
    fechaCreacion: new Date().toISOString(),
} as UsuarioDto

export const usuarioMongo = {
    _id: new Types.ObjectId(),
    nombre: "Juan",
    apellido: "Perez",
    email: "juan@gmail.com",
    username: "juan123",
    password: "123456"
};