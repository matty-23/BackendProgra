import { beforeEach, describe, it, expect, jest, } from '@jest/globals';
import * as model from "../models/usuario.modelo"
import { usuarioRepositoryMock, txtManagerMock, carpetaServiceMock } from "./mocks/usuarioRepository.mock"
import { UsuarioService } from "../../../src/Service/UsuarioService";
import { UsuarioDto } from "../../../src/DTO/UsuarioDTO"
import mongoose from "mongoose";

describe("addUsuario", () => {
    let service: UsuarioService;
    const usuarioId = new mongoose.Types.ObjectId();

    const usuarioDto: UsuarioDto = {
        id: "usuarioId",
        nombre: "Maira",
        apellido: "Troillan",
        email: "maira.troillan@example.com",
        username: "MairaTr",
        password: "12345",
    };

    const usuarioCreado = model.modelosUsuarios.documentoUsuario1;

    const carpetaPrincipal = {
        getId: jest.fn().mockReturnValue("carpeta-principal"),
        AñadirElemento: jest.fn(),
    } as any;

    const crearCarpeta = (nombre: string) => ({
        getNombre: jest.fn().mockReturnValue(nombre),
    } as any);

    beforeEach(() => {
        jest.clearAllMocks();

        service = new UsuarioService(txtManagerMock, usuarioRepositoryMock, carpetaServiceMock);
        txtManagerMock.execute.mockImplementation(
            async <T>(operacion: () => Promise<T>): Promise<T> => {
                return await operacion();
            }
        );
    });


    it("AddUsuario - Usuario creado correctamente", async () => {

        usuarioRepositoryMock.crearUsuario.mockResolvedValue(usuarioId);

        carpetaServiceMock.addCarpeta
            .mockResolvedValueOnce(carpetaPrincipal)
            .mockResolvedValueOnce(crearCarpeta("Mi Area"))
            .mockResolvedValueOnce(crearCarpeta("Compartidos conmigo"))
            .mockResolvedValueOnce(crearCarpeta("Recientes"))
            .mockResolvedValueOnce(crearCarpeta("Destacados"));

        carpetaServiceMock.updateCarpeta.mockResolvedValue(carpetaPrincipal);

        jest.spyOn(service, "getUsuarioById")
            .mockResolvedValue(usuarioCreado);

        const resultado = await service.addUsuario(usuarioDto);

        expect(resultado).toEqual(usuarioCreado);

        expect(usuarioRepositoryMock.crearUsuario)
            .toHaveBeenCalledWith(
                usuarioDto.nombre,
                usuarioDto.apellido!,
                usuarioDto.email,
                usuarioDto.username,
                usuarioDto.password!
            );

        expect(carpetaServiceMock.addCarpeta)
            .toHaveBeenCalledTimes(5);

        expect(carpetaServiceMock.updateCarpeta)
            .toHaveBeenCalledWith(
                "carpeta-principal",
                carpetaPrincipal
            );

        expect(service.getUsuarioById)
            .toHaveBeenCalledWith(usuarioId.toString());

        expect(txtManagerMock.execute)
            .toHaveBeenCalledTimes(1);
    });


    it("AddUsuario - Falta nombre", async () => {

        const dto = {
            ...usuarioDto,
            nombre: ""
        };

        await expect(
            service.addUsuario(dto)
        ).rejects.toThrow(
            "Faltan campos obligatorios para crear el usuario"
        );

        expect(usuarioRepositoryMock.crearUsuario)
            .not.toHaveBeenCalled();

        expect(carpetaServiceMock.addCarpeta)
            .not.toHaveBeenCalled();
    });


    it("AddUsuario - Falta apellido", async () => {

        const dto = {
            ...usuarioDto,
            apellido: ""
        };

        await expect(
            service.addUsuario(dto)
        ).rejects.toThrow(
            "Faltan campos obligatorios para crear el usuario"
        );

        expect(usuarioRepositoryMock.crearUsuario)
            .not.toHaveBeenCalled();
    });


    it("AddUsuario - Falta email", async () => {

        const dto = {
            ...usuarioDto,
            email: ""
        };

        await expect(
            service.addUsuario(dto)
        ).rejects.toThrow(
            "Faltan campos obligatorios para crear el usuario"
        );

        expect(usuarioRepositoryMock.crearUsuario)
            .not.toHaveBeenCalled();
    });


    it("AddUsuario - Falta username", async () => {

        const dto = {
            ...usuarioDto,
            username: ""
        };

        await expect(
            service.addUsuario(dto)
        ).rejects.toThrow(
            "Faltan campos obligatorios para crear el usuario"
        );

        expect(usuarioRepositoryMock.crearUsuario)
            .not.toHaveBeenCalled();
    });


    it("AddUsuario - Falta password", async () => {

        const dto = {
            ...usuarioDto,
            password: ""
        };

        await expect(
            service.addUsuario(dto)
        ).rejects.toThrow(
            "Faltan campos obligatorios para crear el usuario"
        );

        expect(usuarioRepositoryMock.crearUsuario)
            .not.toHaveBeenCalled();
    });


    it("AddUsuario - Error al crear usuario", async () => {

        usuarioRepositoryMock.crearUsuario.mockRejectedValue(
            new Error("Error al crear usuario")
        );

        await expect(
            service.addUsuario(usuarioDto)
        ).rejects.toThrow("Error al crear usuario");

        expect(usuarioRepositoryMock.crearUsuario)
            .toHaveBeenCalledWith(
                usuarioDto.nombre,
                usuarioDto.apellido!,
                usuarioDto.email,
                usuarioDto.username,
                usuarioDto.password!
            );

        expect(carpetaServiceMock.addCarpeta)
            .not.toHaveBeenCalled();
    });


    it("AddUsuario - Error al crear carpeta principal", async () => {

        usuarioRepositoryMock.crearUsuario.mockResolvedValue(usuarioId);

        carpetaServiceMock.addCarpeta.mockRejectedValue(
            new Error("Error al crear carpeta")
        );

        await expect(
            service.addUsuario(usuarioDto)
        ).rejects.toThrow("Error al crear carpeta");

        expect(usuarioRepositoryMock.crearUsuario)
            .toHaveBeenCalled();

        expect(carpetaServiceMock.addCarpeta)
            .toHaveBeenCalledTimes(1);

        expect(carpetaServiceMock.updateCarpeta)
            .not.toHaveBeenCalled();
    });


    it("AddUsuario - Error al crear una carpeta estándar", async () => {

        usuarioRepositoryMock.crearUsuario.mockResolvedValue(usuarioId);

        carpetaServiceMock.addCarpeta
            .mockResolvedValueOnce(carpetaPrincipal)
            .mockResolvedValueOnce(crearCarpeta("Mi Area"))
            .mockRejectedValueOnce(
                new Error("Error al crear Compartidos conmigo")
            );

        await expect(
            service.addUsuario(usuarioDto)
        ).rejects.toThrow(
            "Error al crear Compartidos conmigo"
        );

        expect(carpetaServiceMock.addCarpeta)
            .toHaveBeenCalledTimes(3);

        expect(carpetaServiceMock.updateCarpeta)
            .not.toHaveBeenCalled();
    });


    it("AddUsuario - Error al actualizar carpeta principal", async () => {
        const getUsuarioByIdSpy = jest.spyOn(service, "getUsuarioById");
        usuarioRepositoryMock.crearUsuario.mockResolvedValue(usuarioId);

        carpetaServiceMock.addCarpeta
            .mockResolvedValueOnce(carpetaPrincipal)
            .mockResolvedValueOnce(crearCarpeta("Mi Area"))
            .mockResolvedValueOnce(crearCarpeta("Compartidos conmigo"))
            .mockResolvedValueOnce(crearCarpeta("Recientes"))
            .mockResolvedValueOnce(crearCarpeta("Destacados"));

        carpetaServiceMock.updateCarpeta.mockResolvedValue(false);

        await expect(
            service.addUsuario(usuarioDto)
        ).rejects.toThrow(
            "Error al actualizar la carpeta principal del usuario"
        );

        expect(carpetaServiceMock.addCarpeta)
            .toHaveBeenCalledTimes(5);

        expect(carpetaServiceMock.updateCarpeta)
            .toHaveBeenCalledWith(
                "carpeta-principal",
                carpetaPrincipal
            );

        expect(getUsuarioByIdSpy)
            .not.toHaveBeenCalled();
    });


    it("AddUsuario - Error al recuperar usuario recién creado", async () => {

        usuarioRepositoryMock.crearUsuario.mockResolvedValue(usuarioId);

        carpetaServiceMock.addCarpeta
            .mockResolvedValueOnce(carpetaPrincipal)
            .mockResolvedValueOnce(crearCarpeta("Mi Area"))
            .mockResolvedValueOnce(crearCarpeta("Compartidos conmigo"))
            .mockResolvedValueOnce(crearCarpeta("Recientes"))
            .mockResolvedValueOnce(crearCarpeta("Destacados"));

        carpetaServiceMock.updateCarpeta.mockResolvedValue(
            carpetaPrincipal
        );

        jest.spyOn(service, "getUsuarioById")
            .mockResolvedValue(null);

        await expect(
            service.addUsuario(usuarioDto)
        ).rejects.toThrow(
            "Error crítico al recuperar el usuario recién creado"
        );

        expect(service.getUsuarioById)
            .toHaveBeenCalledWith(usuarioId.toString());
    });


    it("AddUsuario - Error al recuperar usuario recién creado", async () => {

        usuarioRepositoryMock.crearUsuario.mockResolvedValue(usuarioId);

        carpetaServiceMock.addCarpeta
            .mockResolvedValueOnce(carpetaPrincipal)
            .mockResolvedValueOnce(crearCarpeta("Mi Area"))
            .mockResolvedValueOnce(crearCarpeta("Compartidos conmigo"))
            .mockResolvedValueOnce(crearCarpeta("Recientes"))
            .mockResolvedValueOnce(crearCarpeta("Destacados"));

        carpetaServiceMock.updateCarpeta.mockResolvedValue(
            carpetaPrincipal
        );

        jest.spyOn(service, "getUsuarioById")
            .mockRejectedValue(
                new Error("Error al recuperar usuario")
            );

        await expect(
            service.addUsuario(usuarioDto)
        ).rejects.toThrow(
            "Error al recuperar usuario"
        );

        expect(service.getUsuarioById)
            .toHaveBeenCalledWith(usuarioId.toString());
    });


    it("AddUsuario - Añade correctamente las cuatro carpetas a la carpeta principal", async () => {

        usuarioRepositoryMock.crearUsuario.mockResolvedValue(usuarioId);

        const miArea = crearCarpeta("Mi Area");
        const compartidos = crearCarpeta("Compartidos conmigo");
        const recientes = crearCarpeta("Recientes");
        const destacados = crearCarpeta("Destacados");

        carpetaServiceMock.addCarpeta
            .mockResolvedValueOnce(carpetaPrincipal)
            .mockResolvedValueOnce(miArea)
            .mockResolvedValueOnce(compartidos)
            .mockResolvedValueOnce(recientes)
            .mockResolvedValueOnce(destacados);

        carpetaServiceMock.updateCarpeta.mockResolvedValue(
            carpetaPrincipal
        );

        jest.spyOn(service, "getUsuarioById")
            .mockResolvedValue(usuarioCreado);

        await service.addUsuario(usuarioDto);

        expect(carpetaPrincipal.AñadirElemento)
            .toHaveBeenCalledTimes(4);

        expect(carpetaPrincipal.AñadirElemento)
            .toHaveBeenNthCalledWith(1, miArea);

        expect(carpetaPrincipal.AñadirElemento)
            .toHaveBeenNthCalledWith(2, compartidos);

        expect(carpetaPrincipal.AñadirElemento)
            .toHaveBeenNthCalledWith(3, recientes);

        expect(carpetaPrincipal.AñadirElemento)
            .toHaveBeenNthCalledWith(4, destacados);
    });
});