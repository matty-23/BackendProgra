import { jest } from '@jest/globals';
import type { Componente } from '../../../../src/Models/Componente.js';
import  { Documento } from '../../../../src/Models/Documento.js'
import { DocumentoRepository } from '../../../../src/Database/Context/DocumentoRepository.js';
import type { ComponenteRepository } from '../../../../src/Database/Context/ComponenteRepository.js';

export const docRepoMock = {
  obtenerPorId: jest.fn(),
  addDocumento: jest.fn(),
} as unknown as jest.Mocked<DocumentoRepository>;

export const carpetaRepoMock = {
  obtenerPorId: jest.fn(),
};

export const componenteRepoMock = {
  obtenerPorId: jest.fn(),
  crearComponente: jest.fn()
} as unknown as jest.Mocked<ComponenteRepository>;

export const txManagerMock = {
  start: jest.fn(),
  commit: jest.fn(),
  rollback: jest.fn(),
};

export const usuarioRepoMock = {
  getUsuarioById: jest.fn(),
};