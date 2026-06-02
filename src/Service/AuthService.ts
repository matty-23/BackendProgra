import { Injectable } from "@nestjs/common";
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

@Injectable()
export class AuthService implements IAuthService {
    constructor(
        private readonly usuarioService: IUsuarioService,
        private readonly refreshTokenRepository: IRefreshTokenRepository,
        private readonly jwtService: JwtService,
    ) {}

    async register(data: UsuarioDto): Promise<AuthResponseDto> {

    const usuarioExistente =
        await this.usuarioService.getUsuarioByUsername(data.username);

    if (usuarioExistente) {
        throw new RpcException('El usuario ya existe');
    }

    const passwordHasheada = await bcrypt.hash(data.password, 10);

    const nuevoUsuario =
        await this.usuarioService.addUsuario({
            ...data,
            password: passwordHasheada
        });

    const accessToken =
        this.jwtService.generateAccessToken(nuevoUsuario);

    const refreshToken =
        this.jwtService.generateRefreshToken(nuevoUsuario);

    await this.refreshTokenRepository.save(refreshToken, nuevoUsuario.getId());

    return {
        accessToken,
        refreshToken,
        idUsuario: nuevoUsuario.getId(),
        username: nuevoUsuario.getUsername()
    };
}

    async login(data: LoginDto): Promise<AuthResponseDto> {

    const usuario =
        await this.usuarioService.getUsuarioByUsername(data.username);

    if (!usuario) {
        throw new RpcException('Credenciales inválidas');
    }

    const passwordValida =
        await bcrypt.compare(data.password, usuario.getPassword());

    if (!passwordValida) {
        throw new RpcException('Credenciales inválidas');
    }

    const accessToken =
        this.jwtService.generateAccessToken(usuario);

    const refreshToken =
        this.jwtService.generateRefreshToken(usuario);

    await this.refreshTokenRepository.save(refreshToken, usuario.getId());

    return {
        accessToken,
        refreshToken,
        idUsuario: usuario.getId(),
        username: usuario.getUsername()
    };
}

    async refresh(refreshToken: string): Promise<{ accessToken: string }> {

    if (!refreshToken) {
        throw new RpcException('Refresh token requerido');
    }

    const payload =
        this.jwtService.verifyRefreshToken(refreshToken);

    const tokenExiste =
        await this.refreshTokenRepository.findByToken(refreshToken);

    if (!tokenExiste) {
        throw new RpcException('Refresh token inválido');
    }

    const usuario =
        await this.usuarioService.getUsuarioById(payload.idUsuario);

    if (!usuario) {
        throw new RpcException('Usuario no encontrado');
    }

    const accessToken =
        this.jwtService.generateAccessToken(usuario);

    return { accessToken };
}

    async logout(refreshToken: string): Promise<LogoutResponseDto> {

    await this.refreshTokenRepository.deleteByToken(refreshToken);

    return { success: true };
}
}