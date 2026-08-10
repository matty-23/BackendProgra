import { jest } from '@jest/globals';
import type { IUsuarioService } from '../../../../src/Interfaces/IUsuarioService.js';

export const usuarioServiceMock: jest.Mocked<IUsuarioService> ={
    getUsuarioById: jest.fn(),
    getUsuarioByUsername: jest.fn(),
    getUsuarioByEmail: jest.fn(),
    addUsuario: jest.fn(),
    updateUsuario: jest.fn(),
    deleteUsuario: jest.fn(),
}