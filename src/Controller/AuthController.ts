import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { IUsuarioService } from '../Interfaces/IUsuarioService.js';
import type { SignOptions } from 'jsonwebtoken';
import { UsuarioDto } from '../DTO/UsuarioDTO.js';
import { LoginDto } from '../DTO/LoginDTO.js';
import { LogoutDto } from '../DTO/LogoutDTO.js';
import { AuthResponseDto } from '../DTO/AuthResponseDTO.js';
import { LogoutResponseDto } from '../DTO/LogoutResponseDTO.js';

@Controller()
export class AuthController {

    constructor(@Inject('IUsuarioService') private readonly usuarioService: IUsuarioService) { }

    @GrpcMethod('AuthService', 'Register')
    async Register(data: UsuarioDto): Promise<AuthResponseDto> {

        const usuarioExistente = await this.usuarioService.getUsuarioByUsername(data.username);

        if (usuarioExistente) { throw new RpcException('El usuario ya existe'); }
        if (!data.password) { throw new RpcException('La contraseña es requerida'); }
        const passwordHasheada = await bcrypt.hash(data.password, 10);
        const nuevoUsuario = await this.usuarioService.addUsuario({ ...data, password: passwordHasheada });

        const JWT_SECRET = process.env.JWT_SECRET;
        const JWT_EXPIRES_IN: SignOptions['expiresIn'] = process.env.JWT_EXPIRES_IN as SignOptions['expiresIn'];

        const token = jwt.sign(
            {
                idUsuario: nuevoUsuario.getId(),
                username: nuevoUsuario.getUsername()
            },
            JWT_SECRET!,{expiresIn: JWT_EXPIRES_IN!});

        return {
            token,
            idUsuario: nuevoUsuario.getId(),
            username: nuevoUsuario.getUsername()
        };
    }

    @GrpcMethod('AuthService', 'Login')
    async Login(data: LoginDto): Promise<AuthResponseDto> {

        const usuario =
            await this.usuarioService.getUsuarioByUsername(data.username);

        if (!usuario) {
            throw new RpcException('Credenciales inválidas');
        }

        const passwordValida = await bcrypt.compare(
            data.password,
            usuario.getPassword()
        );

        if (!passwordValida) {
            throw new RpcException('Credenciales inválidas');
        }

        const JWT_SECRET = process.env.JWT_SECRET;
        const JWT_EXPIRES_IN: SignOptions['expiresIn'] = process.env.JWT_EXPIRES_IN as SignOptions['expiresIn'];

        const token = jwt.sign(
            {
                idUsuario: usuario.getId(),
                username: usuario.getUsername()
            },
            JWT_SECRET!,{expiresIn: JWT_EXPIRES_IN!});

        return {
            token,
            idUsuario: usuario.getId(),
            username: usuario.getUsername()
        };
    }

    @GrpcMethod('AuthService', 'Logout')
    async Logout(data: LogoutDto): Promise<LogoutResponseDto> {

        if (!data.token) {
            throw new RpcException('Token inválido');
        }

        // Si usaras blacklist de tokens:
        // await this.authService.invalidateToken(data.token);

        return {
            success: true
        };
    }
}