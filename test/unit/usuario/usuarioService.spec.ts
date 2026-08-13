import { beforeEach, describe, it, expect, jest, } from '@jest/globals';
import * as model from "../models/usuario.modelo"
import { usuarioRepositoryMock, txtManagerMock, carpetaServiceMock } from "./mocks/usuarioRepository.mock"
import { UsuarioService } from "../../../src/Service/UsuarioService";
import {UsuarioDto} from "../../../src/DTO/UsuarioDTO"



describe("Test usuarioService", () => {
    let service: UsuarioService;

    beforeEach(() => {
        jest.clearAllMocks();
        service = new UsuarioService(txtManagerMock,usuarioRepositoryMock,carpetaServiceMock);
    });

    it("GetUsuario by ID - Usuario",async () => {
        usuarioRepositoryMock.obtenerUsuarioPorId.mockResolvedValue(model.modelosUsuarios.documentoUsuario1);

        const resultado= await service.getUsuarioById(model.modelosUsuarios.documentoUsuario1.getId());
        expect(resultado).toEqual(model.modelosUsuarios.documentoUsuario1);
        expect(usuarioRepositoryMock.obtenerUsuarioPorId).toHaveBeenCalledWith(model.modelosUsuarios.documentoUsuario1.getId());
    });
    it("GetUsuario by ID - Null",async () => {
        usuarioRepositoryMock.obtenerUsuarioPorId.mockResolvedValue(null);

        const resultado= await service.getUsuarioById(model.modelosUsuarios.documentoUsuario1.getId());
        expect(resultado).toEqual(null);
        expect(usuarioRepositoryMock.obtenerUsuarioPorId).toHaveBeenCalledWith(model.modelosUsuarios.documentoUsuario1.getId());
    });
    it("GetUsuario by ID - ERROR",async () => {
        usuarioRepositoryMock.obtenerUsuarioPorId.mockRejectedValue(new Error("Error"));

        await expect(service.getUsuarioById(model.modelosUsuarios.documentoUsuario1.getId())).rejects.toThrow("Error");
        expect(usuarioRepositoryMock.obtenerUsuarioPorId).toHaveBeenCalledWith(model.modelosUsuarios.documentoUsuario1.getId());
    });
    it("GetUsuario by Username - Usuario",async () => {
        usuarioRepositoryMock.obtenerUsuarioPorUsername.mockResolvedValue(model.modelosUsuarios.documentoUsuario1);

        const resultado= await service.getUsuarioByUsername(model.modelosUsuarios.documentoUsuario1.getUsername());
        expect(resultado).toEqual(model.modelosUsuarios.documentoUsuario1);
        expect(usuarioRepositoryMock.obtenerUsuarioPorUsername).toHaveBeenCalledWith(model.modelosUsuarios.documentoUsuario1.getUsername());
    });
    it("GetUsuario by Username - Null",async () => {
        usuarioRepositoryMock.obtenerUsuarioPorUsername.mockResolvedValue(null);

        const resultado= await service.getUsuarioByUsername(model.modelosUsuarios.documentoUsuario1.getUsername());
        expect(resultado).toEqual(null);
        expect(usuarioRepositoryMock.obtenerUsuarioPorUsername).toHaveBeenCalledWith(model.modelosUsuarios.documentoUsuario1.getUsername());
    });
    it("GetUsuario by Username - Error",async () => {
        usuarioRepositoryMock.obtenerUsuarioPorUsername.mockRejectedValue(new Error("Error"));

        await expect(service.getUsuarioByUsername(model.modelosUsuarios.documentoUsuario1.getUsername())).rejects.toThrow("Error");
        
        expect(usuarioRepositoryMock.obtenerUsuarioPorUsername).toHaveBeenCalledWith(model.modelosUsuarios.documentoUsuario1.getUsername());
    });
    it("GetUsuario by email - Usuario",async () => {
        usuarioRepositoryMock.obtenerUsuarioPorEmail.mockResolvedValue(model.modelosUsuarios.documentoUsuario1);

        const resultado= await service.getUsuarioByEmail(model.modelosUsuarios.documentoUsuario1.getUsername());
        expect(resultado).toEqual(model.modelosUsuarios.documentoUsuario1);
        expect(usuarioRepositoryMock.obtenerUsuarioPorEmail).toHaveBeenCalledWith(model.modelosUsuarios.documentoUsuario1.getUsername());
    });
    it("GetUsuario by email - Null",async () => {
        usuarioRepositoryMock.obtenerUsuarioPorEmail.mockResolvedValue(null);

        const resultado= await service.getUsuarioByEmail(model.modelosUsuarios.documentoUsuario1.getUsername());
        expect(resultado).toEqual(null);
        expect(usuarioRepositoryMock.obtenerUsuarioPorEmail).toHaveBeenCalledWith(model.modelosUsuarios.documentoUsuario1.getUsername());
    });
    it("GetUsuario by email - Error",async () => {
        usuarioRepositoryMock.obtenerUsuarioPorEmail.mockRejectedValue(new Error("Error"));

        await expect(service.getUsuarioByEmail(model.modelosUsuarios.documentoUsuario1.getUsername())).rejects.toThrow("Error");
        
        expect(usuarioRepositoryMock.obtenerUsuarioPorEmail).toHaveBeenCalledWith(model.modelosUsuarios.documentoUsuario1.getUsername());
    });

});