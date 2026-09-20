import { jest } from '@jest/globals';
import type { Componente } from '../../../../src/Models/Componente.js';
import  { Documento } from '../../../../src/Models/Documento.js'
import { DocumentoRepository } from '../../../../src/Database/Context/DocumentoRepository.js';
import type { ComponenteRepository } from '../../../../src/Database/Context/ComponenteRepository.js';
import { UsuarioRepository } from '../../../../src/Database/Context/UsuarioRepository.js';
import { CarpetaRepository } from '../../../../src/Database/Context/CarpetaRepository.js';
import { TransactionManager } from '../../../../src/Database/TransactionManager.js';
export const docRepoMock = {
  obtenerPorId: jest.fn(),
  addDocumento: jest.fn(),
  crear: jest.fn(),
  actualizar: jest.fn(),
} as unknown as jest.Mocked<DocumentoRepository>;

export const carpetaRepoMock = {
  obtenerPorId: jest.fn(),
  añadirComponente: jest.fn(),
} as unknown as jest.Mocked<CarpetaRepository>;

export const componenteRepoMock = {
  obtenerPorId: jest.fn(),
  crearComponente: jest.fn(),
  actualizar: jest.fn(),
} as unknown as jest.Mocked<ComponenteRepository>;

export const txManagerMock = {
  start: jest.fn(),
  commit: jest.fn(),
  rollback: jest.fn(),
  execute: jest.fn(),
} as unknown as jest.Mocked<TransactionManager>

export const usuarioRepoMock = {
  obtenerUsuarioPorId: jest.fn(),
} as unknown as jest.Mocked<UsuarioRepository>;