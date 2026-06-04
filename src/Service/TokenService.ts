import { Injectable } from '@nestjs/common';
import jwt, { type SignOptions } from 'jsonwebtoken';
import type { ITokenService } from '../Interfaces/ITokenService.js';

@Injectable()
export class TokenService  implements ITokenService {
    generateAccessToken(idUsuario: string, username: string): string {
        return jwt.sign(
            { idUsuario, username },
            process.env.JWT_SECRET!,
            { expiresIn: process.env.JWT_EXPIRES_IN as SignOptions['expiresIn'] }
        );
    }

    generateRefreshToken(idUsuario: string): string {
        return jwt.sign(
            { idUsuario },
            process.env.JWT_REFRESH_SECRET!,
            { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'] }
        );
    }

    verifyRefreshToken(token: string): jwt.JwtPayload {
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as jwt.JwtPayload;
    }
}