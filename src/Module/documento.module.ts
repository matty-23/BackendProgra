import { Module, forwardRef } from '@nestjs/common';
import { DocumentoController } from '../Controller/DocumentController.js';
import { DocumentoService } from '../Service/DocumentoService.js';
import { DocumentoRepository } from '../Database/Context/DocumentoRepository.js';
import { DatabaseModule } from './database.module.js';
import { CarpetaModule } from './carpeta.module.js';
import { UsuarioModule } from './UsuarioModule.js';

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => CarpetaModule),
    forwardRef(() => UsuarioModule),
  ],
  controllers: [DocumentoController],
  providers: [
    { provide: 'IDocumentoService', useClass: DocumentoService },
    DocumentoRepository,
  ],
  exports: ['IDocumentoService', DocumentoRepository],
})
export class DocumentoModule {}