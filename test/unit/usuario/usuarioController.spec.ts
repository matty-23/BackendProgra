import { beforeEach, describe, it, expect, jest } from '@jest/globals';
import { UsuarioController } from "../../../src/Controller/UsuarioController"
import { usuarioServiceMock } from "./mocks/usuarioService.mock"
//import { IUsuarioService } from '../../../src/Interfaces/IUsuarioService';
//import { UsuarioService } from '../../../src/Service/UsuarioService';
import * as model from "../models/usuario.modelo"



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


});

