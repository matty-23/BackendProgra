import { Test, TestingModule } from '@nestjs/testing';
import { CarpetaService } from '../../../src/Service/CarpetaService';
import { CarpetaRepository } from '../../../src/Database/Context/CarpetaRepository';
import { ComponenteRepository } from '../../../src/Database/Context/ComponenteRepository';
import { UsuarioRepository } from '../../../src/Database/Context/UsuarioRepository';
import { CarpetaController } from '../../../src/Controller/CarpetaController';
import { JwtGrpcAuthGuard } from '../../../src/Guards/JwtAuthGuard';
import {  mockDocumentoService } from './carpetaMocks';
import { TransactionManager } from '../../../src/Database/TransactionManager';
import { componenteRepoMock,usuarioRepoMock,txManagerMock, } from '../../unit/documentos/mocks/documento.repository.mock';
import { beforeEach, jest } from '@jest/globals';

const mockTokenService = { verifyAccessToken: jest.fn() };

export const module: TestingModule = await Test.createTestingModule({
    controllers: [CarpetaController],
    providers: [
        {
            provide: 'ICarpetaService',
            useClass: CarpetaService,
        },
        CarpetaRepository,
        JwtGrpcAuthGuard,
        {
            provide: 'ITokenService',
            useValue: mockTokenService
        },
        { provide: ComponenteRepository, useValue: componenteRepoMock },
        { provide: TransactionManager, useValue: txManagerMock },
        { provide: 'IDocumentoService', useValue: mockDocumentoService },
        { provide: UsuarioRepository, useValue: usuarioRepoMock },
    ],
}).compile();