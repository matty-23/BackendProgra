import { Injectable, Inject } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import type { IUsuarioService } from '../Interfaces/IUsuarioService.js';
import type { ITokenService } from '../Interfaces/ITokenService.js';
import { UsuarioDto } from '../DTO/UsuarioDTO.js';
import { LoginDto } from '../DTO/LoginDto.js';
import { AuthResponseDto } from '../DTO/AuthResponseDto.js';
import { TokenDto } from '../DTO/TokenDto.js';
import type { IAuthService } from '../Interfaces/IAuthService.js';
import { TokenRepository } from '../Database/Context/TokenRepository.js';
import { forwardRef } from '@nestjs/common';

@Injectable()
export class AuthService implements IAuthService {
    constructor(
        @Inject('IUsuarioService') private readonly usuarioService: IUsuarioService,
        @Inject('ITokenService') private readonly tokenService: ITokenService,
        @Inject(forwardRef(() => TokenRepository)) private readonly refreshTokenRepo: TokenRepository
    ) {}
    
    async register(data: UsuarioDto): Promise<AuthResponseDto> {
        if (!data.password) throw new RpcException('La contraseña es requerida');

        const usernameExistente = await this.usuarioService.getUsuarioByUsername(data.username);
        if (usernameExistente) throw new RpcException('El nombre de usuario ya está en uso');

        const emailExistente = await (this.usuarioService as any).getUsuarioByEmail(data.email);
        if (emailExistente) throw new RpcException('El correo electrónico ya está registrado');

        const passwordHasheada = await bcrypt.hash(data.password, 10);
        const nuevoUsuario = await this.usuarioService.addUsuario({ ...data, password: passwordHasheada });

        return this.generarTokens(nuevoUsuario.getId(), nuevoUsuario.getUsername());
    }

    async login(data: LoginDto): Promise<AuthResponseDto> {
        if (!data.username || !data.password) throw new RpcException('Usuario y contraseña son requeridos');

        const usuario = await this.usuarioService.getUsuarioByUsername(data.username);
        if (!usuario) throw new RpcException('Credenciales inválidas');

        const passwordValida = await bcrypt.compare(data.password, usuario.getPassword());
        if (!passwordValida) throw new RpcException('Credenciales inválidas');

        return this.generarTokens(usuario.getId(), usuario.getUsername());
    }

    async refresh(data: TokenDto): Promise<{ accessToken: string }> {
        try {
            const payload = this.tokenService.verifyRefreshToken(data.refreshToken);
            
            const tokenGuardado = await this.refreshTokenRepo.obtenerPorToken(data.refreshToken);
            if (!tokenGuardado) throw new RpcException('Refresh token inválido o revocado');

            const usuario = await this.usuarioService.getUsuarioById(payload.idUsuario);
            if (!usuario) throw new RpcException('Usuario no encontrado');

            const accessToken = this.tokenService.generateAccessToken(usuario.getId(), usuario.getUsername());
            
            return { accessToken };
        } catch (error) {
            throw new RpcException('Refresh token inválido o expirado');
        }
    }

    async logout(token: string): Promise<{ success: boolean }> {
        await this.refreshTokenRepo.eliminarPorToken(token);
        return { success: true };
    }

    private async generarTokens(idUsuario: string, username: string): Promise<AuthResponseDto> {
        const accessToken = this.tokenService.generateAccessToken(idUsuario, username);
        const refreshToken = this.tokenService.generateRefreshToken(idUsuario);

        const expiresInDays = parseInt(process.env.JWT_REFRESH_EXPIRES_IN!); 

        await this.guardarTokens(refreshToken, idUsuario, expiresInDays);

        return {
            accessToken,
            refreshToken,
            idUsuario,
            username
        };
    }

    private async guardarTokens(refreshToken: string, idUsuario: string, expiresInDays: number) {
        try { 
            await this.refreshTokenRepo.guardar(refreshToken, idUsuario, expiresInDays);
        } catch(error) {
            throw error;
        }
    }
}