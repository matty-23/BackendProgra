import { beforeEach, describe, it, expect, jest } from '@jest/globals'; import { DocumentoService } from "../../../src/Service/DocumentoService.js";
import { docRepoMock, carpetaRepoMock, componenteRepoMock, txManagerMock, usuarioRepoMock } from "./mocks/documento.repository.mock.js";
import { Documento } from "../../../src/Models/Documento.js";
import { Componente } from "../../../src/Models/Componente.js";
import { modelosComponente } from '../modelos/component.modelo.js';
import { modelosDocumentos, documentoDto } from '../modelos/document.modelo.js';
import { model } from 'mongoose';
import { modelosUsuarios } from '../modelos/usuario.modelo.js';
import { modeloTransacion } from '../modelos/transaction.modelo.js';
import { modelosCarpeta } from '../modelos/carpeta.modelo.js';


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
        const resultado = await service.getDocumentoById('507f1f77bcf86cd799439011');

        expect(resultado).toEqual(modelosDocumentos.documentoUsuario1);
        expect(docRepoMock.obtenerPorId).toHaveBeenCalledWith('507f1f77bcf86cd799439011', modelosComponente.compDocUsuario1);

    })

    it('docService.ByID.ERRORComponente', async () => {
        componenteRepoMock.obtenerPorId.mockResolvedValue(null);
        docRepoMock.obtenerPorId.mockResolvedValue(modelosDocumentos.documentoUsuario1)
        await expect(service.getDocumentoById('507f1f77bcf86cd799439011')).rejects.toThrow('Componente no encontrado');
    }
    )
    it('docService.ByID.ERRORDocumento', async () => {
        componenteRepoMock.obtenerPorId.mockResolvedValue(modelosComponente.compDocUsuario1);
        docRepoMock.obtenerPorId.mockResolvedValue(null)
        await expect(service.getDocumentoById('507f1f77bcf86cd799439011')).rejects.toThrow('Documento no encontrado');
    }
    )
    it('docService.ERRORCompNoCoincide', async () => {
        componenteRepoMock.obtenerPorId.mockResolvedValue(modelosComponente.compCarpUsuario1);
        docRepoMock.obtenerPorId.mockResolvedValue(modelosDocumentos.documentoUsuario1)
        await expect(service.getDocumentoById('12345678910111213')).rejects.toThrow('El componente no pertenece a un tipo documento');
    })
}),

    describe('DocService.AddDocumento', () => {
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

        it('docService.Add.200(OK)', async () => {
            usuarioRepoMock.obtenerUsuarioPorId.mockResolvedValue(modelosUsuarios.Usuario1);
            componenteRepoMock.crearComponente.mockResolvedValue(modelosComponente.ObjtIDCompoDocUSuario1);
            docRepoMock.crear.mockResolvedValue(modelosDocumentos.ObjtIDdocumentoUSuario1);
            carpetaRepoMock.añadirComponente.mockResolvedValue(modelosCarpeta.arrayComponente);
            const resultado = await service.addDocumento(documentoDto, '507f1f77bcf86cd799439011');

            expect(modeloTransacion).toHaveBeenCalledTimes(1);
            expect(resultado.getIdUsuario()).toBe(modelosDocumentos.documentoUsuario1.getIdUsuario());

            expect(resultado.getNombre()).toBe(modelosDocumentos.documentoUsuario1.getNombre());

            expect(resultado.getVersion()).toBe(modelosDocumentos.documentoUsuario1.getVersion());

            expect(docRepoMock.crear).toHaveBeenCalledWith('507f1f77bcf86cd799439011', 'PENDING_UPLOAD', '1.0');
            expect(usuarioRepoMock.obtenerUsuarioPorId).toHaveBeenCalledWith(modelosDocumentos.documentoUsuario1.getIdUsuario())
            expect(componenteRepoMock.crearComponente).toHaveBeenCalledWith(modelosDocumentos.documentoUsuario1.getNombre(), modelosDocumentos.documentoUsuario1.getIdUsuario(), 'documento')

        })

        it('docService.Add.ERRORUsuarioNoExiste', async () => {
            usuarioRepoMock.obtenerUsuarioPorId.mockRejectedValue(
                new Error('Usuario no encontrado')
            );

            await expect(
                service.addDocumento(
                    documentoDto,
                    '507f1f77bcf86cd799439011'
                )
            ).rejects.toThrow(
                'El idUsuario proporcionado no existe o no es válido.'
            );

            expect(usuarioRepoMock.obtenerUsuarioPorId).toHaveBeenCalledWith(
                documentoDto.idUsuario
            );

            expect(modeloTransacion).not.toHaveBeenCalled();
            expect(componenteRepoMock.crearComponente).not.toHaveBeenCalled();
            expect(docRepoMock.crear).not.toHaveBeenCalled();
            expect(carpetaRepoMock.añadirComponente).not.toHaveBeenCalled();
        });


        it('docService.Add.ERRORCrearComponente', async () => {
            usuarioRepoMock.obtenerUsuarioPorId.mockResolvedValue(
                modelosUsuarios.Usuario1
            );

            componenteRepoMock.crearComponente.mockRejectedValue(
                new Error('Error al crear componente')
            );

            await expect(
                service.addDocumento(
                    documentoDto,
                    '507f1f77bcf86cd799439011'
                )
            ).rejects.toThrow('Error al crear componente');

            expect(usuarioRepoMock.obtenerUsuarioPorId).toHaveBeenCalledWith(
                documentoDto.idUsuario
            );

            expect(componenteRepoMock.crearComponente).toHaveBeenCalledWith(
                documentoDto.nombre,
                documentoDto.idUsuario,
                'documento'
            );

            expect(docRepoMock.crear).not.toHaveBeenCalled();
            expect(carpetaRepoMock.añadirComponente).not.toHaveBeenCalled();
        });


        it('docService.Add.ERRORCrearDocumento', async () => {
            usuarioRepoMock.obtenerUsuarioPorId.mockResolvedValue(
                modelosUsuarios.Usuario1
            );

            componenteRepoMock.crearComponente.mockResolvedValue(
                modelosComponente.ObjtIDCompoDocUSuario1
            );

            docRepoMock.crear.mockRejectedValue(
                new Error('Error al crear documento')
            );

            await expect(
                service.addDocumento(
                    documentoDto,
                    '507f1f77bcf86cd799439011'
                )
            ).rejects.toThrow('Error al crear documento');

            expect(componenteRepoMock.crearComponente).toHaveBeenCalledWith(
                documentoDto.nombre,
                documentoDto.idUsuario,
                'documento'
            );

            expect(docRepoMock.crear).toHaveBeenCalledWith(
                modelosComponente.ObjtIDCompoDocUSuario1.toString(),
                'PENDING_UPLOAD',
                '1.0'
            );

            expect(carpetaRepoMock.añadirComponente).not.toHaveBeenCalled();
        });


        it('docService.Add.ERRORAñadirComponenteCarpeta', async () => {
            usuarioRepoMock.obtenerUsuarioPorId.mockResolvedValue(
                modelosUsuarios.Usuario1
            );

            componenteRepoMock.crearComponente.mockResolvedValue(
                modelosComponente.ObjtIDCompoDocUSuario1
            );

            docRepoMock.crear.mockResolvedValue(
                modelosDocumentos.ObjtIDdocumentoUSuario1
            );

            carpetaRepoMock.añadirComponente.mockRejectedValue(
                new Error('Error al añadir componente a la carpeta')
            );

            await expect(
                service.addDocumento(
                    documentoDto,
                    '507f1f77bcf86cd799439011'
                )
            ).rejects.toThrow('Error al añadir componente a la carpeta');

            expect(componenteRepoMock.crearComponente).toHaveBeenCalled();
            expect(docRepoMock.crear).toHaveBeenCalled();

            expect(carpetaRepoMock.añadirComponente).toHaveBeenCalled();
        });


        it('docService.Add.ERRORTransaccion', async () => {
            usuarioRepoMock.obtenerUsuarioPorId.mockResolvedValue(
                modelosUsuarios.Usuario1
            );

            modeloTransacion.mockRejectedValue(
                new Error('Error en la transacción')
            );

            await expect(
                service.addDocumento(
                    documentoDto,
                    '507f1f77bcf86cd799439011'
                )
            ).rejects.toThrow('Error en la transacción');

            expect(modeloTransacion).toHaveBeenCalledTimes(1);
        });

    })
describe('DocService.UpdateDocumento', () => {
    let service: DocumentoService;

    beforeEach(() => {
        jest.clearAllMocks();
        service = new DocumentoService(
            docRepoMock as any,
            carpetaRepoMock as any,
            componenteRepoMock as any,
            txManagerMock as any,
            usuarioRepoMock as any,
        );
    })

    it('docService.Update.200(OK)', async () => {
        const documentoDto: any = {
            id: '507f1f77bcf86cd799439011',
            nombre: 'Nuevo Nombre',
            idUsuario: 'user123',
            estado: 'APROBADO',
            version: 2
        };

        componenteRepoMock.obtenerPorId.mockResolvedValue(modelosComponente.compDocUsuario1);
        docRepoMock.obtenerPorId.mockResolvedValue(modelosDocumentos.documentoUsuario1);
        componenteRepoMock.actualizar.mockResolvedValue(modelosComponente.compDocUsuario1);
        docRepoMock.actualizar.mockResolvedValue(modelosDocumentos.documentoUsuario1);

        const resultado = await service.updateDocumento(documentoDto);

        expect(resultado).toBe(true);
        expect(componenteRepoMock.obtenerPorId).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
        expect(docRepoMock.obtenerPorId).toHaveBeenCalledWith('507f1f77bcf86cd799439011', modelosComponente.compDocUsuario1);
        expect(componenteRepoMock.actualizar).toHaveBeenCalledTimes(1);
        expect(docRepoMock.actualizar).toHaveBeenCalledTimes(1);
    })

    it('docService.Update.ERRORIdRequerido', async () => {
        const documentoDtoSinId: any = { nombre: 'Doc sin ID' };

        await expect(service.updateDocumento(documentoDtoSinId)).rejects.toThrow('El id del documento es requerido para la actualización.');
        expect(componenteRepoMock.obtenerPorId).not.toHaveBeenCalled();
    })

    it('docService.Update.ERRORComponente', async () => {
        const documentoDto: any = { id: '507f1f77bcf86cd799439011', nombre: 'Doc Test' };

        componenteRepoMock.obtenerPorId.mockResolvedValue(null);

        await expect(service.updateDocumento(documentoDto)).rejects.toThrow('Componente no encontrado');
        expect(docRepoMock.obtenerPorId).not.toHaveBeenCalled();
    })

    it('docService.Update.ERRORDocumento', async () => {
        const documentoDto: any = { id: '507f1f77bcf86cd799439011', nombre: 'Doc Test' };

        componenteRepoMock.obtenerPorId.mockResolvedValue(modelosComponente.compDocUsuario1);
        docRepoMock.obtenerPorId.mockResolvedValue(null);

        await expect(service.updateDocumento(documentoDto)).rejects.toThrow('Documento no encontrado');
        expect(componenteRepoMock.actualizar).not.toHaveBeenCalled();
    })

    it('docService.Update.200(OK)_ConValoresPorDefecto', async () => {
        const documentoDto: any = {
            id: '507f1f77bcf86cd799439011',
            nombre: 'Nuevo Nombre',
            idUsuario: 'user123'
            // estado y version no definidos para probar el fallback al documento existente
        };

        componenteRepoMock.obtenerPorId.mockResolvedValue(modelosComponente.compDocUsuario1);
        docRepoMock.obtenerPorId.mockResolvedValue(modelosDocumentos.documentoUsuario1);
        componenteRepoMock.actualizar.mockResolvedValue(modelosComponente.compDocUsuario1);
        docRepoMock.actualizar.mockResolvedValue(modelosDocumentos.documentoUsuario1);

        const resultado = await service.updateDocumento(documentoDto);

        expect(resultado).toBe(true);
        expect(docRepoMock.actualizar).toHaveBeenCalledTimes(1);
    })
})
