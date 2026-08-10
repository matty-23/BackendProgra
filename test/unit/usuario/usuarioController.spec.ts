import { beforeEach, describe, it, expect, jest } from '@jest/globals';
import { UsuarioController } from "../../../src/Controller/UsuarioController"
import { usuarioServiceMock } from "./mocks/usuarioService.mock"
import { IUsuarioService } from '../../../src/Interfaces/IUsuarioService';
import { UsuarioService } from '../../../src/Service/UsuarioService';
import { modelosUsuarios } from "../models/usuario.modelo"

export class usuarioControllerTest {

    async GetTest() {
        describe("UsuarioController", () => {
            let controller: UsuarioController;

            beforeEach(() => {
                jest.clearAllMocks();
                controller = new UsuarioController(usuarioServiceMock as any);
            });

            it("Get by Id- Return 200", async() =>{
                usuarioServiceMock.getUsuarioById.mockResolvedValue(modelosUsuarios.documentoUsuario1);
                
                const resultado = await controller.getById({id : modelosUsuarios.documentoUsuario1.getId()});
            });
        });
    }
}