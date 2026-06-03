import { Module } from '@nestjs/common';
import { CarpetaController } from './Controller/CarpetaController.js'; 
import { DocumentoController } from './Controller/DocumentController.js'; 
import { CarpetaService } from './Service/CarpetaService.js';
import { DocumentoService } from './Service/DocumentoService.js';
import { UsuarioRepository } from './Database/Context/UsuarioRepository.js';
import { TransactionManager } from './Database/TransactionManager.js';
import { UsuarioController } from './Controller/UsuarioController.js';
import { UsuarioService } from './Service/UsuarioService.js';
import { ComponenteRepository } from './Database/Context/ComponenteRepository.js';
import { DocumentoRepository } from './Database/Context/DocumentoRepository.js';
import { CarpetaRepository } from './Database/Context/CarpetaRepository.js';
import { AuthController } from './Controller/AuthController.js';
import { AuthService } from './Service/AuthService.js';
import { TokenService } from './Service/TokenService.js';
import { TokenRepository } from './Database/Context/TokenRepository.js';

@Module({
  imports: [],
  controllers: [CarpetaController, DocumentoController, UsuarioController, AuthController],
  providers: [
    TransactionManager,
    UsuarioRepository,
    CarpetaRepository,   
    ComponenteRepository, 
    DocumentoRepository,
    TokenRepository, 
    { provide: 'ICarpetaService', useClass: CarpetaService },
    { provide: 'IDocumentoService', useClass: DocumentoService },
    { provide: 'IUsuarioService', useClass: UsuarioService },
    { provide: 'ITokenService', useClass: TokenService }, 
    { provide: 'IAuthService', useClass: AuthService }, 
  ],
})
export class AppModule {}