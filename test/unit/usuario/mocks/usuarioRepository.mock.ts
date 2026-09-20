import { jest } from '@jest/globals';
import type { UsuarioRepository } from '../../../../src/Database/Context/UsuarioRepository';
import { TransactionManager } from '../../../../src/Database/TransactionManager.js';
import type { ICarpetaService } from "../../../../src/Interfaces/ICarpetaService.js";

export const usuarioRepositoryMock: jest.Mocked<UsuarioRepository> = {
    crearUsuario: jest.fn(),
    obtenerUsuarioPorId: jest.fn(),
    obtenerUsuarioPorUsername: jest.fn(),
    obtenerUsuarioPorEmail: jest.fn(),
    actualizarUsuario: jest.fn(),
    eliminarUsuario: jest.fn(),
}

export const txtManagerMock = {
    execute: jest.fn(
        async <T>(operacion: () => Promise<T>): Promise<T> => {
            return await operacion();
        }
    ),
} as jest.Mocked<TransactionManager>;

export const carpetaServiceMock: jest.Mocked<ICarpetaService> = {
    getCarpetasUsuario: jest.fn(),
    getCarpetaById: jest.fn(),
    addCarpeta: jest.fn(),
    updateCarpeta: jest.fn(),
    deleteCarpeta: jest.fn(),
    getComponentesCarpeta: jest.fn(),
    traerLasCarpetasPrincipales: jest.fn(),
}