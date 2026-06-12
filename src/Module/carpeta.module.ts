import { Module, forwardRef } from '@nestjs/common';
import { CarpetaController } from '../Controller/CarpetaController.js';
import { CarpetaService } from '../Service/CarpetaService.js';
import { CarpetaRepository } from '../Database/Context/CarpetaRepository.js';
import { ComponenteRepository } from '../Database/Context/ComponenteRepository.js';
import { DatabaseModule } from './database.module.js';
import { DocumentoModule } from './documento.module.js';
import { UsuarioModule } from './UsuarioModule.js';

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => DocumentoModule),
    forwardRef(() => UsuarioModule),
  ],
  controllers: [CarpetaController],
  providers: [
    { provide: 'ICarpetaService', useClass: CarpetaService },
    CarpetaRepository,
    ComponenteRepository,
  ],
  exports: ['ICarpetaService', CarpetaRepository, ComponenteRepository],
})
export class CarpetaModule {}