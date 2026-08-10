import { beforeEach, describe, it, expect, jest } from '@jest/globals';import { DocumentoService } from "../../../src/Service/DocumentoService.js";
import { docRepoMock, carpetaRepoMock, componenteRepoMock, txManagerMock, usuarioRepoMock } from "./mocks/documento.repository.mock.js";
import { Documento } from "../../../src/Models/Documento.js";
import { Componente } from "../../../src/Models/Componente.js";
import { modelosComponente } from '../modelos/component.modelo.js';
import { modelosDocumentos } from '../modelos/document.modelo.js';
import { model } from 'mongoose';
describe('DocService.GetById', () => {

    let service: DocumentoService;

    beforeEach(() => {
        jest.clearAllMocks();
        service = new DocumentoService(
            docRepoMock as any,
            carpetaRepoMock as any,
            componenteRepoMock as any,
            txManagerMock as any,
            usuarioRepoMock as any,);
    })



    it('docService.ByID.200(OK)', async () => {

        docRepoMock.obtenerPorId.mockResolvedValue(modelosDocumentos.documentoUsuario1);
        componenteRepoMock.obtenerPorId.mockResolvedValue(modelosComponente.compDocUsuario1);
        const resultado = await service.getDocumentoById('123');

        expect(resultado).toEqual(modelosDocumentos.documentoUsuario1);
        expect(docRepoMock.obtenerPorId).toHaveBeenCalledWith('123', modelosComponente.compDocUsuario1);

    })

    it('docService.ByID.ERRORComponente', async () => {
        componenteRepoMock.obtenerPorId.mockResolvedValue(null);
        docRepoMock.obtenerPorId.mockResolvedValue(modelosDocumentos.documentoUsuario1)
        await expect(service.getDocumentoById('123')).rejects.toThrow('Componente no encontrado');
    }
    )
    it('docService.ByID.ERRORDocumento', async () => {
        componenteRepoMock.obtenerPorId.mockResolvedValue(modelosComponente.compDocUsuario1);
        docRepoMock.obtenerPorId.mockResolvedValue(null)
        await expect(service.getDocumentoById('123')).rejects.toThrow('Documento no encontrado');
    }
    )
    it('docService.ERRORCompNoCoincide', async () => {
        componenteRepoMock.obtenerPorId.mockResolvedValue(modelosComponente.compCarpUsuario1);
        docRepoMock.obtenerPorId.mockResolvedValue(modelosDocumentos.documentoUsuario1)
        await expect(service.getDocumentoById('123')).rejects.toThrow('El componente no pertenece a un tipo documento');
    })
}),

describe('DocService.AddDocumento', ()=>{
    let service: DocumentoService;
    beforeEach(() => {
        jest.clearAllMocks();
        service = new DocumentoService(
            docRepoMock as any,
            carpetaRepoMock as any,
            componenteRepoMock as any,
            txManagerMock as any,
            usuarioRepoMock as any,);
    })

    it('docService.Add.200(OK)', async ()=>{
        
    })

})