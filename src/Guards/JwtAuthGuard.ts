import { Injectable, type  CanActivate, type ExecutionContext} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { status, Metadata } from '@grpc/grpc-js';

@Injectable()
export class JwtGrpcAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = context.switchToRpc().getContext();
    
    const metadata: Metadata = ctx instanceof Metadata ? ctx : (ctx as any);

    const authHeader = metadata.get('authorization');

    const rawToken = authHeader?.[0];
    const token =typeof rawToken === 'string'? rawToken.replace(/^Bearer\s+/i, ''): Buffer.isBuffer(rawToken)? rawToken.toString('utf8').replace(/^Bearer\s+/i, ''): null;

    if (!token) {
      throw new RpcException({
        code: status.UNAUTHENTICATED,
        message: 'No se proporcionó token de autenticación.',
      });
    }

    try {
      const payload = this.jwtService.verify(token);
      metadata.set('user', JSON.stringify(payload));
      
      return true;
    } catch (err) {
      throw new RpcException({
        code: status.UNAUTHENTICATED,
        message: 'Token inválido o expirado.',
      });
    }
  }
}