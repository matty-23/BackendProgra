export interface IAuthService {
    register(data: UsuarioDto): Promise<AuthResponseDto>;
    login(data: LoginDto): Promise<AuthResponseDto>;
    refresh(refreshToken: string): Promise<{ accessToken: string }>;
    logout(refreshToken: string): Promise<LogoutResponseDto>;
}