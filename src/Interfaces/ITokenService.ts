import type { JwtPayload } from 'jsonwebtoken';
export interface ITokenService{
    generateAccessToken(idUsuario: string, username: string): string;
    generateRefreshToken(idUsuario: string): string;
    verifyAccessToken(token: string): JwtPayload;
    verifyRefreshToken(token: string): any; 
}