import { Module, forwardRef } from '@nestjs/common';
import { UsuarioController } from '../Controller/UsuarioController.js';
import { UsuarioService } from '../Service/UsuarioService.js';
import { UsuarioRepository } from '../Database/Context/UsuarioRepository.js';
import { DatabaseModule } from './database.module.js';
import { CarpetaModule } from './carpeta.module.js';

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => CarpetaModule),
  ],
  controllers: [UsuarioController],
  providers: [
    { provide: 'IUsuarioService', useClass: UsuarioService },
    UsuarioRepository,
  ],
  exports: ['IUsuarioService', UsuarioRepository],
})
export class UsuarioModule {}