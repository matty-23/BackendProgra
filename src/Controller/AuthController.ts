// src/Controller/AuthController.ts
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthService } from '../Service/AuthService.js';
import { UsuarioDto } from '../DTO/UsuarioDTO.js';
import { LoginDto } from '../DTO/LoginDto.js';
import { LogoutDto } from '../DTO/LogoutDto.js';
import { TokenDto } from '../DTO/TokenDto.js';
import { AuthResponseDto } from '../DTO/AuthResponseDto.js';
import { LogoutResponseDto } from '../DTO/LogoutResponseDto.js';

@Controller()
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @GrpcMethod('AuthService', 'Register')
    async Register(data: UsuarioDto): Promise<AuthResponseDto> {
        return await this.authService.register(data);
    }

    @GrpcMethod('AuthService', 'Login')
    async Login(data: LoginDto): Promise<AuthResponseDto> {
        return await this.authService.login(data);
    }

    @GrpcMethod('AuthService', 'Refresh')
    async Refresh(data: TokenDto): Promise<{ accessToken: string }> {
        return await this.authService.refresh(data);
    }

    @GrpcMethod('AuthService', 'Logout')
    async Logout(data: LogoutDto): Promise<LogoutResponseDto> {
        return await this.authService.logout(data.token);
    }
}