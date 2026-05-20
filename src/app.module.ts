import { Module } from '@nestjs/common';
import { CarpetaController } from './Controller/CarpetaController.js'; // Ajusta la ruta real
import { DocumentoController } from './Controller/DocumentController.js'; // Ajusta la ruta real
import { CarpetaService } from './Service/CarpetaService.js';
import { DocumentoService } from './Service/DocumentoService.js';
import { UsuarioRepository } from './Database/Context/UsuarioRepository.js';
import { TransactionManager } from './Database/TransactionManager.js';
import { UsuarioController } from './Controller/UsuarioController.js';
import { UsuarioService } from './Service/UsuarioService.js';
import { ComponenteRepository } from './Database/Context/ComponenteRepository.js';
import { DocumentoRepository } from './Database/Context/DocumentoRepository.js';
import { CarpetaRepository } from './Database/Context/CarpetaRepository.js';

@Module({
  imports: [],
  controllers: [CarpetaController, DocumentoController, UsuarioController],
  providers: [
    TransactionManager,
    UsuarioRepository,
    CarpetaRepository,   
    ComponenteRepository, 
    DocumentoRepository,  
    { provide: 'ICarpetaService', useClass: CarpetaService },
    { provide: 'IDocumentoService', useClass: DocumentoService },
    { provide: 'IUsuarioService', useClass: UsuarioService },
  ],
})
export class AppModule {}