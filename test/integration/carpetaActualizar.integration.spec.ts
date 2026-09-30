import { beforeEach, describe, it, expect, jest } from '@jest/globals';
import { CarpetaController } from '../../src/Controller/CarpetaController';
import { JwtGrpcAuthGuard } from '../../src/Guards/JwtAuthGuard';
import { mockearMongooseFindOne,mockearMongooseUpdate } from './mocks/carpetaMocks';
import { payloadUpdate } from './modelos/componente';
import { module } from "./mocks/moduleMock";
import { componenteRepoMock, usuarioRepoMock, txManagerMock } from '../unit/documentos/mocks/documento.repository.mock';
import { RpcException } from '@nestjs/microservices';
import { mockComponente, mockCarpetaMongo, mockId } from "./modelos/componente";
import { CarpetaModel } from '../../src/Database/Schemes/CarpetaScheme';
import { transactionContext } from '../../src/Database/TransactionContext';
import { Types } from "mongoose";
import { usuarioMock } from "./modelos/usuario";

describe("Tests de integración de Carpeta Actualizar", () => {
    let controller: CarpetaController;
    let guard: JwtGrpcAuthGuard;

    beforeEach(async () => {
        jest.clearAllMocks();
        
        controller = module.get<CarpetaController>(CarpetaController);
        guard = module.get<JwtGrpcAuthGuard>(JwtGrpcAuthGuard);
        
        usuarioRepoMock.obtenerUsuarioPorId.mockResolvedValue(usuarioMock);
        componenteRepoMock.obtenerPorId.mockResolvedValue(mockComponente);
        componenteRepoMock.actualizar.mockResolvedValue(mockComponente);
        
        jest.spyOn(transactionContext, 'getStore').mockReturnValue(undefined);

        mockearMongooseFindOne(mockCarpetaMongo);
    });

    it("1. debería actualizar la carpeta correctamente (Happy Path)", async () => {
        mockearMongooseUpdate({ ...mockCarpetaMongo, ReadMe: "Readme modificado" });

        const resultado = await controller.actualizar(payloadUpdate);

        expect(componenteRepoMock.actualizar).toHaveBeenCalledWith(mockId, expect.anything());
        expect(CarpetaModel.findByIdAndUpdate).toHaveBeenCalled();
        
        expect(resultado).toBeDefined(); 
    });

    it("2. debería lanzar RpcException (NOT_FOUND) si el Componente base no existe", async () => {
        componenteRepoMock.obtenerPorId.mockResolvedValue(null);

        await expect(controller.actualizar(payloadUpdate)).rejects.toThrow(RpcException);
        await expect(controller.actualizar(payloadUpdate)).rejects.toThrow(/no encontrada para actualizar/);

        expect(CarpetaModel.findOne).not.toHaveBeenCalled();
        expect(componenteRepoMock.actualizar).not.toHaveBeenCalled();
    });

    it("3. debería lanzar RpcException (NOT_FOUND) si la Carpeta no existe", async () => {
        mockearMongooseFindOne(null);

        await expect(controller.actualizar(payloadUpdate)).rejects.toThrow(RpcException);
        await expect(controller.actualizar(payloadUpdate)).rejects.toThrow(/no encontrada para actualizar/);

        expect(usuarioRepoMock.obtenerUsuarioPorId).not.toHaveBeenCalled();
        expect(componenteRepoMock.actualizar).not.toHaveBeenCalled();
    });

    it("4. debería fallar si el Usuario no existe (simulado por un error en el Repo)", async () => {
        usuarioRepoMock.obtenerUsuarioPorId.mockRejectedValue(new Error("Usuario no encontrado"));

        await expect(controller.actualizar(payloadUpdate)).rejects.toThrow(RpcException);
        await expect(controller.actualizar(payloadUpdate)).rejects.toThrow("El idUsuario proporcionado para la actualización no existe o no es válido.");

        expect(componenteRepoMock.actualizar).not.toHaveBeenCalled();
        expect(CarpetaModel.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    it("5. debería fallar si hay un error al buscar el Componente", async () => {
        componenteRepoMock.obtenerPorId.mockRejectedValue(new Error("Fallo de BD en Componentes"));

        await expect(controller.actualizar(payloadUpdate)).rejects.toThrow(RpcException);
        await expect(controller.actualizar(payloadUpdate)).rejects.toThrow("Fallo de BD en Componentes");
        
        expect(CarpetaModel.findOne).not.toHaveBeenCalled();
    });

    it("6. debería fallar si falla la actualización del Componente", async () => {
        componenteRepoMock.actualizar.mockRejectedValue(new Error("Error actualizando Componente"));

        await expect(controller.actualizar(payloadUpdate)).rejects.toThrow(RpcException);
        await expect(controller.actualizar(payloadUpdate)).rejects.toThrow("Error actualizando Componente");

        expect(CarpetaModel.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    it("7. debería lanzar RpcException (NOT_FOUND) si Mongoose devuelve null al actualizar", async () => {
        mockearMongooseUpdate(null);

        // Como el service devuelve false cuando la actualización da null, el controller tira NOT_FOUND
        await expect(controller.actualizar(payloadUpdate)).rejects.toThrow(RpcException);
        await expect(controller.actualizar(payloadUpdate)).rejects.toThrow(/no encontrada para actualizar/);
    });

    it("8. debería fallar si la actualización de la Carpeta falla por un error de Mongoose", async () => {
        mockearMongooseUpdate(null, new Error("Timeout en MongoDB al actualizar"));

        await expect(controller.actualizar(payloadUpdate)).rejects.toThrow(RpcException);
        await expect(controller.actualizar(payloadUpdate)).rejects.toThrow("Timeout en MongoDB al actualizar");
    });

});