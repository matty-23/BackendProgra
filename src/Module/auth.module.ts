import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from '../Controller/AuthController.js';
import { AuthService } from '../Service/AuthService.js';
import { TokenService } from '../Service/TokenService.js';
import { TokenRepository } from '../Database/Context/TokenRepository.js';
import { UsuarioModule } from './UsuarioModule.js';

@Module({
  imports: [
    UsuarioModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'tu_secreto_super_seguro',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    { provide: 'IAuthService', useClass: AuthService },
    { provide: 'ITokenService', useClass: TokenService },
    TokenRepository,
  ],
  exports: [JwtModule],
})
export class AuthModule {}