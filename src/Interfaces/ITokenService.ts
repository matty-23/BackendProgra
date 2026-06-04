export interface ITokenService{
    generateAccessToken(idUsuario: string, username: string): string;
    generateRefreshToken(idUsuario: string): string;
    verifyRefreshToken(token: string): any; 
}