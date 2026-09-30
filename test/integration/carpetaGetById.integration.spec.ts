import { beforeEach, describe, it, expect, jest } from '@jest/globals';
import { CarpetaController } from '../../src/Controller/CarpetaController';
import { JwtGrpcAuthGuard } from '../../src/Guards/JwtAuthGuard';
import { module } from "./mocks/moduleMock";
import { mockDocumentoService } from './mocks/carpetaMocks';
import { componenteRepoMock, usuarioRepoMock, txManagerMock, } from '../unit/documentos/mocks/documento.repository.mock';
import { TransactionManager } from '../../src/Database/TransactionManager';
import { Metadata } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';
import { mockComponente, mockCarpetaMongo, mockId } from "./modelos/componente";
import { CarpetaModel } from '../../src/Database/Schemes/CarpetaScheme';
import { transactionContext } from '../../src/Database/TransactionContext';
import { Types } from "mongoose";

describe("Tests de integración de Carpeta getById", () => {
    let controller: CarpetaController;
    let guard: JwtGrpcAuthGuard;

    beforeEach(async () => {
        jest.clearAllMocks();
        controller = module.get<CarpetaController>(CarpetaController);
        guard = module.get<JwtGrpcAuthGuard>(JwtGrpcAuthGuard);
    });

    it("debería obtener la carpeta correctamente pasando por todas las capas", async () => {

        componenteRepoMock.obtenerPorId.mockResolvedValue(mockComponente);

        const execMock = jest.fn<any>().mockResolvedValue(mockCarpetaMongo);
        const leanMock = jest.fn<any>().mockReturnValue({ exec: execMock });
        const sessionMock = jest.fn<any>().mockReturnValue({ lean: leanMock });

        jest.spyOn(transactionContext, 'getStore').mockReturnValue(undefined);
        jest.spyOn(CarpetaModel, 'findOne').mockReturnValue({ session: sessionMock } as any);

        const resultado = await controller.getById({ id: mockId });

        expect(CarpetaModel.findOne).toHaveBeenCalledWith({ _id: new Types.ObjectId(mockId) });

        expect(resultado).toBeDefined();
        expect(resultado.nombre).toBe("Carpeta de Universidad");
        expect(resultado.ReadMe).toBe("Contenido del archivo ReadMe");
    });
    it("debería fallar/devolver error si el Componente no existe", async () => {
        componenteRepoMock.obtenerPorId.mockResolvedValue(null);

        await expect(controller.getById({ id: mockId })).rejects.toThrow();
        expect(CarpetaModel.findOne).not.toHaveBeenCalled();
    });
    it("debería fallar/devolver error si el Componente lanza un error inesperado ", async () => {
        componenteRepoMock.obtenerPorId.mockRejectedValue(new Error("Timeout en la base de datos de componentes"));

        await expect(controller.getById({ id: mockId })).rejects.toThrow("Timeout en la base de datos de componentes");
        expect(CarpetaModel.findOne).not.toHaveBeenCalled();
    });
    it("debería manejar el error si el repository salta", async () => {
        componenteRepoMock.obtenerPorId.mockResolvedValue(mockComponente);

        const execMock = jest.fn<any>().mockResolvedValue(null);
        const leanMock = jest.fn<any>().mockReturnValue({ exec: execMock });
        const sessionMock = jest.fn<any>().mockReturnValue({ lean: leanMock });

        jest.spyOn(CarpetaModel, 'findOne').mockReturnValue({ session: sessionMock } as any);
        await expect(controller.getById({ id: mockId })).rejects.toThrow();
        expect(CarpetaModel.findOne).toHaveBeenCalledWith({ _id: new Types.ObjectId(mockId) });
    });

    it("debería manejar el error si ocurre un fallo en Mongoose al buscar la Carpeta", async () => {
        componenteRepoMock.obtenerPorId.mockResolvedValue(mockComponente);

        const execMock = jest.fn<any>().mockRejectedValue(new Error("Error de conexión con MongoDB"));
        const leanMock = jest.fn<any>().mockReturnValue({ exec: execMock });
        const sessionMock = jest.fn<any>().mockReturnValue({ lean: leanMock });

        jest.spyOn(CarpetaModel, 'findOne').mockReturnValue({ session: sessionMock } as any);

        await expect(controller.getById({ id: mockId })).rejects.toThrow("Error de conexión con MongoDB");
        expect(CarpetaModel.findOne).toHaveBeenCalledWith({ _id: new Types.ObjectId(mockId) });
    });

});