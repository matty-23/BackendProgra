import { Injectable } from '@nestjs/common';
import jwt, { type SignOptions } from 'jsonwebtoken';
import type { ITokenService } from '../Interfaces/ITokenService.js';
import type { JwtPayload } from 'jsonwebtoken';
@Injectable()
export class TokenService implements ITokenService {
    generateAccessToken(idUsuario: string, username: string): string {
        const secret = process.env.JWT_SECRET;
        const expiresIn = process.env.JWT_EXPIRES_IN;

        if (!secret || !expiresIn) {
            throw new Error('JWT configuration missing');
        }

        return jwt.sign(
            { idUsuario, username },
            secret,
            { expiresIn }
        );
    }

    verifyAccessToken(token: string): JwtPayload {
        return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
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