import { beforeEach, describe, it, expect, jest, } from '@jest/globals';
import * as model from "../models/usuario.modelo";
import { Types,} from 'mongoose';
import { UsuarioModel } from '../../../src/Database/Schemes/UsuarioScheme';
import { UsuarioRepository } from '../../../src/Database/Context/UsuarioRepository';
import { transactionContext } from '../../../src/Database/TransactionContext';

describe("Test usuarioRepository", ()=>{
    let repository: UsuarioRepository
    beforeEach(()=>{
         jest.clearAllMocks();
         repository=new UsuarioRepository();
    });

    it("Crear Usuario - Devuelve ID",async ()=>{
        const id =new Types.ObjectId()
        const saveMock = jest.spyOn(UsuarioModel.prototype, 'save').mockResolvedValue({_id:  id,} as any);
        jest.spyOn(transactionContext, 'getStore').mockReturnValue(undefined);
        const resultado = await repository.crearUsuario(model.modelosUsuarios.documentoUsuario1.getNombre(),
        model.modelosUsuarios.documentoUsuario1.getApellido(),
        model.modelosUsuarios.documentoUsuario1.getEmail(),
        model.modelosUsuarios.documentoUsuario1.getUsername(),
        model.modelosUsuarios.documentoUsuario1.getPassword(),
    );
        expect(resultado).toEqual(id);
        expect(saveMock).toHaveBeenCalledWith({});
        expect(saveMock.mock.instances[0]).toBeDefined();
        });
    it("Crear Usuario - Devuelve Error",async ()=>{

        jest.spyOn(UsuarioModel.prototype, 'save').mockRejectedValue(new Error('Error al guardar usuario'));
        jest.spyOn(transactionContext, 'getStore').mockReturnValue(undefined);
        await expect(repository.crearUsuario(model.modelosUsuarios.documentoUsuario1.getNombre(),
        model.modelosUsuarios.documentoUsuario1.getApellido(),
        model.modelosUsuarios.documentoUsuario1.getEmail(),
        model.modelosUsuarios.documentoUsuario1.getUsername(),
        model.modelosUsuarios.documentoUsuario1.getPassword(),
    )).rejects.toThrow(new Error('Error al guardar usuario'));

        });
});