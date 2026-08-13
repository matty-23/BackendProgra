import { beforeEach, describe, it, expect, jest, } from '@jest/globals';
import * as model from "../models/usuario.modelo"
import { usuarioRepositoryMock, txtManagerMock, carpetaServiceMock } from "./mocks/usuarioRepository.mock"
import { UsuarioService } from "../../../src/Service/UsuarioService";


describe("Test usuarioService", () => {
    let service: UsuarioService;

    beforeEach(() => {
        jest.clearAllMocks();
        service = new UsuarioService(txtManagerMock, usuarioRepositoryMock, carpetaServiceMock);
        txtManagerMock.execute.mockImplementation(
            async <T>(operacion: () => Promise<T>): Promise<T> => {
                return await operacion();
            }
        );
    });

    it("GetUsuario by ID - Usuario", async () => {
        usuarioRepositoryMock.obtenerUsuarioPorId.mockResolvedValue(model.modelosUsuarios.documentoUsuario1);

        const resultado = await service.getUsuarioById(model.modelosUsuarios.documentoUsuario1.getId());
        expect(resultado).toEqual(model.modelosUsuarios.documentoUsuario1);
        expect(usuarioRepositoryMock.obtenerUsuarioPorId).toHaveBeenCalledWith(model.modelosUsuarios.documentoUsuario1.getId());
    });
    it("GetUsuario by ID - Null", async () => {
        usuarioRepositoryMock.obtenerUsuarioPorId.mockResolvedValue(null);

        const resultado = await service.getUsuarioById(model.modelosUsuarios.documentoUsuario1.getId());
        expect(resultado).toEqual(null);
        expect(usuarioRepositoryMock.obtenerUsuarioPorId).toHaveBeenCalledWith(model.modelosUsuarios.documentoUsuario1.getId());
    });
    it("GetUsuario by ID - ERROR", async () => {
        usuarioRepositoryMock.obtenerUsuarioPorId.mockRejectedValue(new Error("Error"));

        await expect(service.getUsuarioById(model.modelosUsuarios.documentoUsuario1.getId())).rejects.toThrow("Error");
        expect(usuarioRepositoryMock.obtenerUsuarioPorId).toHaveBeenCalledWith(model.modelosUsuarios.documentoUsuario1.getId());
    });
    it("GetUsuario by Username - Usuario", async () => {
        usuarioRepositoryMock.obtenerUsuarioPorUsername.mockResolvedValue(model.modelosUsuarios.documentoUsuario1);

        const resultado = await service.getUsuarioByUsername(model.modelosUsuarios.documentoUsuario1.getUsername());
        expect(resultado).toEqual(model.modelosUsuarios.documentoUsuario1);
        expect(usuarioRepositoryMock.obtenerUsuarioPorUsername).toHaveBeenCalledWith(model.modelosUsuarios.documentoUsuario1.getUsername());
    });
    it("GetUsuario by Username - Null", async () => {
        usuarioRepositoryMock.obtenerUsuarioPorUsername.mockResolvedValue(null);

        const resultado = await service.getUsuarioByUsername(model.modelosUsuarios.documentoUsuario1.getUsername());
        expect(resultado).toEqual(null);
        expect(usuarioRepositoryMock.obtenerUsuarioPorUsername).toHaveBeenCalledWith(model.modelosUsuarios.documentoUsuario1.getUsername());
    });
    it("GetUsuario by Username - Error", async () => {
        usuarioRepositoryMock.obtenerUsuarioPorUsername.mockRejectedValue(new Error("Error"));

        await expect(service.getUsuarioByUsername(model.modelosUsuarios.documentoUsuario1.getUsername())).rejects.toThrow("Error");

        expect(usuarioRepositoryMock.obtenerUsuarioPorUsername).toHaveBeenCalledWith(model.modelosUsuarios.documentoUsuario1.getUsername());
    });
    it("GetUsuario by email - Usuario", async () => {
        usuarioRepositoryMock.obtenerUsuarioPorEmail.mockResolvedValue(model.modelosUsuarios.documentoUsuario1);

        const resultado = await service.getUsuarioByEmail(model.modelosUsuarios.documentoUsuario1.getEmail());
        expect(resultado).toEqual(model.modelosUsuarios.documentoUsuario1);
        expect(usuarioRepositoryMock.obtenerUsuarioPorEmail).toHaveBeenCalledWith(model.modelosUsuarios.documentoUsuario1.getEmail());
    });
    it("GetUsuario by email - Null", async () => {
        usuarioRepositoryMock.obtenerUsuarioPorEmail.mockResolvedValue(null);

        const resultado = await service.getUsuarioByEmail(model.modelosUsuarios.documentoUsuario1.getEmail());
        expect(resultado).toEqual(null);
        expect(usuarioRepositoryMock.obtenerUsuarioPorEmail).toHaveBeenCalledWith(model.modelosUsuarios.documentoUsuario1.getEmail());
    });
    it("GetUsuario by email - Error", async () => {
        usuarioRepositoryMock.obtenerUsuarioPorEmail.mockRejectedValue(new Error("Error"));

        await expect(service.getUsuarioByEmail(model.modelosUsuarios.documentoUsuario1.getEmail())).rejects.toThrow("Error");

        expect(usuarioRepositoryMock.obtenerUsuarioPorEmail).toHaveBeenCalledWith(model.modelosUsuarios.documentoUsuario1.getEmail());
    });

    it("Actualizar Usuario - True", async () => {

        const resultado = await service.updateUsuario(model.modelosUsuariosDto);
        expect(resultado).toEqual(true);
        expect(usuarioRepositoryMock.actualizarUsuario).toHaveBeenCalledWith(model.modelosUsuarios.documentoUsuario2.getId(),expect.objectContaining({
        nombre: model.modelosUsuariosDto.nombre,
        apellido: model.modelosUsuariosDto.apellido,
        email: model.modelosUsuariosDto.email,
        username: model.modelosUsuariosDto.username
    }));
    });
    it("Actualizar Usuario - Error", async () => {
        usuarioRepositoryMock.actualizarUsuario.mockRejectedValue(new Error());

        await expect(service.updateUsuario(model.modelosUsuariosDto)).rejects.toThrow("Error al actualizar el usuario");
        expect(usuarioRepositoryMock.actualizarUsuario).toHaveBeenCalledWith(model.modelosUsuarios.documentoUsuario2.getId(), expect.objectContaining({
            nombre: model.modelosUsuariosDto.nombre,
            apellido: model.modelosUsuariosDto.apellido,
            email: model.modelosUsuariosDto.email,
            username: model.modelosUsuariosDto.username
        }));
    });
    it("DeleteUsuario - Usuario con carpeta principal", async () => {
        const userId = model.modelosUsuarios.documentoUsuario1.getId();

        const CarpetaPrincipal = { getId: jest.fn().mockReturnValue(userId), getNombre: jest.fn().mockReturnValue(userId), } as any;
        carpetaServiceMock.getCarpetasUsuario.mockResolvedValue([CarpetaPrincipal]);
        carpetaServiceMock.deleteCarpeta.mockResolvedValue(true);

        const resultado = await service.deleteUsuario(userId);

        expect(resultado).toBe(true);
        expect(carpetaServiceMock.getCarpetasUsuario).toHaveBeenCalledWith(userId);
        expect(carpetaServiceMock.deleteCarpeta).toHaveBeenCalledWith(userId);
        expect(usuarioRepositoryMock.eliminarUsuario).toHaveBeenCalledWith(userId);
    });

    it("DeleteUsuario - Error al eliminar las carpetas", async () => {
        const id = model.modelosUsuariosDto2.id;
        const CarpetaPrincipal = { getId: jest.fn().mockReturnValue(id), getNombre: jest.fn().mockReturnValue(id), } as any;

        carpetaServiceMock.getCarpetasUsuario.mockResolvedValue([CarpetaPrincipal]);
        carpetaServiceMock.deleteCarpeta.mockResolvedValue(false);

        await expect(service.deleteUsuario(id)).rejects.toThrow("Fallo al eliminar las carpetas asociadas al usuario.");
        expect(carpetaServiceMock.deleteCarpeta).toHaveBeenCalledWith(CarpetaPrincipal.getId());
        expect(usuarioRepositoryMock.eliminarUsuario).not.toHaveBeenCalled();
    });

    it("DeleteUsuario - Error al obtener carpetas", async () => {
        const id = model.modelosUsuariosDto2.id;

        carpetaServiceMock.getCarpetasUsuario.mockRejectedValue(new Error("Error al obtener carpetas"));

        await expect(service.deleteUsuario(id)).rejects.toThrow("Error al obtener carpetas");
        expect(carpetaServiceMock.deleteCarpeta).not.toHaveBeenCalled();
        expect(usuarioRepositoryMock.eliminarUsuario).not.toHaveBeenCalled();
    });

    it("DeleteUsuario - Error al eliminar usuario", async () => {
        const id = model.modelosUsuariosDto2.id;
        const carpetaPrincipal = { getId: jest.fn().mockReturnValue(id), getNombre: jest.fn().mockReturnValue(id), } as any;

        carpetaServiceMock.getCarpetasUsuario.mockResolvedValue([carpetaPrincipal]);
        carpetaServiceMock.deleteCarpeta.mockResolvedValue(true);

        usuarioRepositoryMock.eliminarUsuario.mockRejectedValue(new Error("Error al eliminar usuario"));

        await expect(service.deleteUsuario(id)).rejects.toThrow( "Error al eliminar usuario");
        expect(carpetaServiceMock.deleteCarpeta).toHaveBeenCalledWith(carpetaPrincipal.getId());
        expect(usuarioRepositoryMock.eliminarUsuario).toHaveBeenCalledWith(id);
    });

});