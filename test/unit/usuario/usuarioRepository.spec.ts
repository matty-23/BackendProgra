import { beforeEach, describe, it, expect, jest, } from '@jest/globals';
import * as model from "../models/usuario.modelo";
import { Types,} from 'mongoose';
import { UsuarioModel } from '../../../src/Database/Schemes/UsuarioScheme';
import { UsuarioRepository } from '../../../src/Database/Context/UsuarioRepository';
import { transactionContext } from '../../../src/Database/TransactionContext';
import { Usuario } from '../../../src/Models/Usuario';

describe("Test usuarioRepository", ()=>{
    let repository: UsuarioRepository
    beforeEach(()=>{
         jest.clearAllMocks();
         repository=new UsuarioRepository();
    });
    
    it("Crear Usuario - Devuelve ID",async ()=>{
        const saveMock = jest.spyOn(UsuarioModel.prototype, 'save').mockResolvedValue({_id:  model.usuarioMongo._id,} as any);
        jest.spyOn(transactionContext, 'getStore').mockReturnValue(undefined);
        const resultado = await repository.crearUsuario(model.modelosUsuarios.documentoUsuario1.getNombre(),
        model.modelosUsuarios.documentoUsuario1.getApellido(),
        model.modelosUsuarios.documentoUsuario1.getEmail(),
        model.modelosUsuarios.documentoUsuario1.getUsername(),
        model.modelosUsuarios.documentoUsuario1.getPassword(),
    );
        expect(resultado).toEqual(model.usuarioMongo._id);
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

    it("Obtener Usuario por ID - Devuelve Usuario", async () => {

        const leanMock = jest.fn<() => Promise<any>>().mockResolvedValue(model.usuarioMongo);
        const sessionMock = jest.fn().mockReturnValue({lean: leanMock});

        jest.spyOn(UsuarioModel, 'findById').mockReturnValue({session: sessionMock} as any);
        jest.spyOn(transactionContext, 'getStore').mockReturnValue(undefined);

        const resultado = await repository.obtenerUsuarioPorId(model.usuarioMongo._id.toString());

        expect(resultado).toBeInstanceOf(Usuario);

        expect(resultado).toEqual(new Usuario(model.usuarioMongo._id.toString(),"Juan","Perez","juan@gmail.com","juan123","123456"));

        expect(UsuarioModel.findById).toHaveBeenCalledWith(model.usuarioMongo._id.toString());
        expect(sessionMock).toHaveBeenCalledWith(null);
        expect(leanMock).toHaveBeenCalledWith();
    });


    it("Obtener Usuario por ID - Usuario no encontrado", async () => {

        const leanMock = jest.fn<() => Promise<any>>().mockResolvedValue(null);
        const sessionMock = jest.fn().mockReturnValue({lean: leanMock});

        jest.spyOn(UsuarioModel, 'findById').mockReturnValue({session: sessionMock} as any);
        jest.spyOn(transactionContext, 'getStore').mockReturnValue(undefined);

        const resultado = await repository.obtenerUsuarioPorId(model.usuarioMongo._id.toString());

        expect(resultado).toBeNull();
    });

    it("Obtener Usuario por Username - Devuelve Usuario", async () => {

        const leanMock = jest.fn<() => Promise<any>>().mockResolvedValue(model.usuarioMongo);
        const sessionMock = jest.fn().mockReturnValue({lean: leanMock });

        jest.spyOn(UsuarioModel, 'findOne').mockReturnValue({session: sessionMock} as any);
        jest.spyOn(transactionContext, 'getStore').mockReturnValue(undefined);

        const resultado = await repository.obtenerUsuarioPorUsername(model.usuarioMongo.username);

        expect(resultado).toBeInstanceOf(Usuario);
        expect(resultado).toEqual(new Usuario(model.usuarioMongo._id.toString(),"Juan", "Perez","juan@gmail.com","juan123","123456"));
        expect(UsuarioModel.findOne).toHaveBeenCalledWith({username: model.usuarioMongo.username});
        expect(sessionMock).toHaveBeenCalledWith(null);
    });


    it("Obtener Usuario por Username - Usuario no encontrado", async () => {

        const leanMock = jest.fn<() => Promise<any>>().mockResolvedValue(null);
        const sessionMock = jest.fn().mockReturnValue({lean: leanMock});

        jest.spyOn(UsuarioModel, 'findOne').mockReturnValue({session: sessionMock} as any);
        jest.spyOn(transactionContext, 'getStore').mockReturnValue(undefined);

        const resultado = await repository.obtenerUsuarioPorUsername(model.usuarioMongo.username);
        expect(resultado).toBeNull();
    });

    it("Obtener Usuario por Email - Devuelve Usuario", async () => {


        const leanMock = jest.fn<() => Promise<any>>().mockResolvedValue(model.usuarioMongo);

        const sessionMock = jest.fn().mockReturnValue({ lean: leanMock});

        jest.spyOn(UsuarioModel, 'findOne').mockReturnValue({session: sessionMock} as any);
        jest.spyOn(transactionContext, 'getStore').mockReturnValue(undefined);

        const resultado = await repository.obtenerUsuarioPorEmail(model.usuarioMongo.email);

        expect(resultado).toBeInstanceOf(Usuario);
        expect(resultado).toEqual(new Usuario(model.usuarioMongo._id.toString(),"Juan", "Perez","juan@gmail.com","juan123","123456"));
        expect(UsuarioModel.findOne).toHaveBeenCalledWith({email: model.usuarioMongo.email});
        expect(sessionMock).toHaveBeenCalledWith(null);
    });


    it("Obtener Usuario por Email - Usuario no encontrado", async () => {

        const leanMock = jest.fn<() => Promise<any>>().mockResolvedValue(null);
        const sessionMock = jest.fn().mockReturnValue({lean: leanMock});

        jest.spyOn(UsuarioModel, 'findOne').mockReturnValue({session: sessionMock} as any);
        jest.spyOn(transactionContext, 'getStore').mockReturnValue(undefined);

        const resultado = await repository.obtenerUsuarioPorEmail(model.usuarioMongo.email);
        expect(resultado).toBeNull();
    });


    it("Actualizar Usuario - Actualiza correctamente", async () => {

        const datosActualizar: Partial<Usuario>= model.modelosUsuarios.documentoUsuario1;
        const findByIdAndUpdateMock = jest.spyOn(UsuarioModel, 'findByIdAndUpdate').mockResolvedValue(model.usuarioMongo._id);

        await expect(repository.actualizarUsuario(model.usuarioMongo._id.toString(), datosActualizar)).resolves.toBeUndefined();
        expect(findByIdAndUpdateMock).toHaveBeenCalledWith(model.usuarioMongo._id.toString(),datosActualizar);
    });


    it("Actualizar Usuario - Usuario no encontrado", async () => {

        jest.spyOn(UsuarioModel, 'findByIdAndUpdate') .mockResolvedValue(null);
        await expect(repository.actualizarUsuario(model.usuarioMongo._id.toString(),model.modelosUsuarios.documentoUsuario1) ).rejects.toThrow("Usuario no encontrado para actualizar");
    });

    it("Eliminar Usuario - Elimina correctamente", async () => {

        const sessionMock = jest.fn<(session: any) => any>().mockResolvedValue(model.usuarioMongo._id);

        jest.spyOn(UsuarioModel, 'findByIdAndDelete').mockReturnValue({ session: sessionMock} as any);
        jest.spyOn(transactionContext, 'getStore').mockReturnValue(undefined);

        await expect( repository.eliminarUsuario(model.usuarioMongo._id.toString())).resolves.toBeUndefined();
        expect(UsuarioModel.findByIdAndDelete).toHaveBeenCalledWith(model.usuarioMongo._id.toString());
        expect(sessionMock).toHaveBeenCalledWith(null);
    });


    it("Eliminar Usuario - Usuario no encontrado", async () => {

        const sessionMock = jest.fn<() => Promise<any>>().mockResolvedValue(null);

        jest.spyOn(UsuarioModel, 'findByIdAndDelete').mockReturnValue({session: sessionMock} as any);
        jest.spyOn(transactionContext, 'getStore').mockReturnValue(undefined);

        await expect(repository.eliminarUsuario(model.usuarioMongo._id.toString() )).rejects.toThrow("Usuario no encontrado para eliminar");
    });
});