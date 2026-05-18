import { Module } from '@nestjs/common';
import { CarpetaController } from './Controller/CarpetaController.js'; // Ajusta la ruta real
import { DocumentoController } from './Controller/DocumentController.js'; // Ajusta la ruta real
import { CarpetaService } from './Service/CarpetaService.js';
import { DocumentoService } from './Service/DocumentoService.js';

@Module({
  imports: [],
  controllers: [CarpetaController, DocumentoController],
  providers: [
    { provide: 'ICarpetaService', useClass: CarpetaService },
    { provide: 'IDocumentoService', useClass: DocumentoService },
  ],
})
export class AppModule {}