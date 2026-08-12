import { beforeEach, describe, it, expect, jest, } from '@jest/globals';
import { UsuarioController } from "../../../src/Controller/UsuarioController"
import { usuarioServiceMock } from "./mocks/usuarioService.mock"
//import { IUsuarioService } from '../../../src/Interfaces/IUsuarioService';
//import { UsuarioService } from '../../../src/Service/UsuarioService';
import { RpcException } from "@nestjs/microservices";
import * as model from "../models/usuario.modelo"
import { status } from '@grpc/grpc-js';


describe("UsuarioController", () => {
    let controller: UsuarioController;

    beforeEach(() => {
        jest.clearAllMocks();
        controller = new UsuarioController(usuarioServiceMock as any);
    });

    it("Get by Id- Return 200", async () => {
        usuarioServiceMock.getUsuarioById.mockResolvedValue(model.modelosUsuarios.documentoUsuario2);

        const resultado = await controller.getById({ id: model.modelosUsuarios.documentoUsuario2.getId() });
        expect(resultado).toEqual(model.modelosUsuariosDto);
        expect(usuarioServiceMock.getUsuarioById).toHaveBeenCalledWith(model.modelosUsuarios.documentoUsuario2.getId());
    });
    it("Get by Id- Return NOT_FOUND", async () => {
        usuarioServiceMock.getUsuarioById.mockResolvedValue(null);

        try {
            await controller.getById({ id: "32" });

            throw new Error("Se esperaba una RpcException");
        } catch (error) {
            expect(error).toBeInstanceOf(RpcException);

            if (error instanceof RpcException) {
                expect(error.getError()).toEqual({
                    code: status.NOT_FOUND,
                    message: "Usuario con ID 32 no encontrado."
                });
            }
        }
        expect(usuarioServiceMock.getUsuarioById).toHaveBeenCalledWith("32");
    });

    it("Get by Username- Return 200", async () => {
        usuarioServiceMock.getUsuarioByUsername.mockResolvedValue(model.modelosUsuarios.documentoUsuario2);
        const resultado = await controller.getUsuarioByUsername({username : model.modelosUsuarios.documentoUsuario2.getUsername()});
        
        expect(resultado).toEqual(model.modelosUsuariosDto);
        expect(usuarioServiceMock.getUsuarioByUsername).toHaveBeenCalledWith("MairaTr");
    });

    it("Get by Username- Return NOT_FOUND", async () => {
        usuarioServiceMock.getUsuarioByUsername.mockResolvedValue(null);

        try {
            await controller.getUsuarioByUsername({ username: "MairaT" });

            throw new Error("Se esperaba una RpcException");
        } catch (error) {
            expect(error).toBeInstanceOf(RpcException);

            if (error instanceof RpcException) {
                expect(error.getError()).toEqual({
                    code: status.NOT_FOUND,
                    message: "Usuario con username MairaT no encontrado."
                });
            }
        }
        expect(usuarioServiceMock.getUsuarioByUsername).toHaveBeenCalledWith("MairaT");
    });

    it("Patch actualizar- Return True", async () => {
        usuarioServiceMock.updateUsuario.mockResolvedValue(true);
        const resultado = await controller.actualizar({id:"usuario-2", usuario:model.modelosUsuariosDto});
        
        expect(resultado).toEqual({"success": true});
        expect(usuarioServiceMock.updateUsuario).toHaveBeenCalledWith(model.modelosUsuariosDto);
    });

     it("Patch actualizar- Return INVALID_ARGUMENT", async () => {

        try {
            await controller.actualizar({id:"usuario-5", usuario:model.modelosUsuariosDto});

            throw new Error("Se esperaba una RpcException");
        } catch (error) {
            expect(error).toBeInstanceOf(RpcException);

            if (error instanceof RpcException) {
                expect(error.getError()).toEqual({
                    code: status.INVALID_ARGUMENT,
                    message: "El ID de la ruta no coincide con el ID del cuerpo de la petición."
                });
            }
        }
    });
     it("Patch actualizar- Return NOT_FOUND", async () => {
        usuarioServiceMock.updateUsuario.mockResolvedValue(false);

        try {
            await controller.actualizar({id:"usuario-3", usuario:model.modelosUsuariosDto2});

            throw new Error("Se esperaba una RpcException");
        } catch (error) {
            expect(error).toBeInstanceOf(RpcException);

            if (error instanceof RpcException) {
                expect(error.getError()).toEqual({
                    code: status.NOT_FOUND,
                    message: "Usuario con ID usuario-3 no encontrado para actualizar."
                });
            }
        }
        expect(usuarioServiceMock.updateUsuario).toHaveBeenCalledWith(model.modelosUsuariosDto2);
    });
     it("Patch actualizar- Return INTERNAL", async () => {
        usuarioServiceMock.updateUsuario.mockRejectedValue(new Error("Error al actualizar el usuario"));

        try {
            await controller.actualizar({id:"usuario-3", usuario:model.modelosUsuariosDto2});

            throw new Error("Se esperaba una RpcException");
        } catch (error) {
            expect(error).toBeInstanceOf(RpcException);

            if (error instanceof RpcException) {
                expect(error.getError()).toEqual({
                    code: status.INTERNAL,
                    message: error.message || "Error interno al actualizar el usuario."
                });
            }
        }
        expect(usuarioServiceMock.updateUsuario).toHaveBeenCalledWith(model.modelosUsuariosDto2);
    });
    it("DELETE eliminar- Return true", async () => {
        usuarioServiceMock.deleteUsuario.mockResolvedValue(true);

        const resultado = await controller.eliminar({id: "usuario-3"});
        expect(resultado).toEqual({"success": true});
        expect(usuarioServiceMock.deleteUsuario).toHaveBeenCalledWith("usuario-3");
    });
    it("Delete eliminar- Return INTERNAL", async () => {
        usuarioServiceMock.deleteUsuario.mockRejectedValue(new Error("Error al eliminar el usuario"));

        try {
            await controller.eliminar({id:"usuario-3"});

            throw new Error("Se esperaba una RpcException");
        } catch (error) {
            expect(error).toBeInstanceOf(RpcException);

            if (error instanceof RpcException) {
                expect(error.getError()).toEqual({
                    code: status.INTERNAL,
                    message: error.message || "Error interno al actualizar el usuario."
                });
            }
        }
        expect(usuarioServiceMock.deleteUsuario).toHaveBeenCalledWith("usuario-3");
    });
    it("Delete eliminar- Return NOT_FOUND", async () => {
        usuarioServiceMock.deleteUsuario.mockResolvedValue(false);

        try {
            await controller.eliminar({id:"usuario-3"});

            throw new Error("Se esperaba una RpcException");
        } catch (error) {
            expect(error).toBeInstanceOf(RpcException);

            if (error instanceof RpcException) {
                expect(error.getError()).toEqual({
                    code: status.NOT_FOUND,
                    message: "Usuario con ID usuario-3 no encontrado para eliminar."
                });
            }
        }
        expect(usuarioServiceMock.deleteUsuario).toHaveBeenCalledWith("usuario-3");
    });
});

