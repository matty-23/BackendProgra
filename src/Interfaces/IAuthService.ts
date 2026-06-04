import { LoginDto } from '../DTO/LoginDto.js';
import { AuthResponseDto } from '../DTO/AuthResponseDto.js';
import { UsuarioDto } from '../DTO/UsuarioDTO.js';
import { LogoutResponseDto } from '../DTO/LogoutResponseDto.js';
import type { TokenDto } from '../DTO/TokenDto.js';

export interface IAuthService {
    register(data: UsuarioDto): Promise<AuthResponseDto>;
    login(data: LoginDto): Promise<AuthResponseDto>;
    refresh(refreshToken: TokenDto): Promise<{ accessToken: string }>;
    logout(refreshToken: string): Promise<LogoutResponseDto>;
}