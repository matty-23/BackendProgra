import { beforeEach, describe, it, expect, jest } from '@jest/globals';
import { CarpetaController } from '../../src/Controller/CarpetaController';
import { JwtGrpcAuthGuard } from '../../src/Guards/JwtAuthGuard';
import { module } from "./mocks/moduleMock";
import { componenteRepoMock } from '../unit/documentos/mocks/documento.repository.mock';
import { mockearMongooseDeleteOne,mockearMongooseFindOne,mockearMongooseUpdateMany } from './mocks/carpetaMocks';
import { mockId } from "./modelos/componente";
import { CarpetaRepository } from '../../src/Database/Context/CarpetaRepository';
import { CarpetaModel } from '../../src/Database/Schemes/CarpetaScheme';
import { transactionContext } from '../../src/Database/TransactionContext';
import { RpcException } from '@nestjs/microservices';
import { Types } from "mongoose";
import { TransactionManager } from '../../src/Database/TransactionManager';

describe("Tests de integración de Carpeta Eliminar ", () => {
    let controller: CarpetaController;
    let guard: JwtGrpcAuthGuard;
    let documentoService: any; 

    beforeEach(async () => {
        // RESET limpia tanto el historial como los valores de retorno previos
        jest.resetAllMocks(); 
        
        controller = module.get<CarpetaController>(CarpetaController);
        guard = module.get<JwtGrpcAuthGuard>(JwtGrpcAuthGuard);
        documentoService = module.get('IDocumentoService'); 
        
        // 1. Forzamos al TransactionManager a ejecutar el bloque interno (usando la clase como Token)
        const txManager = module.get<TransactionManager>(TransactionManager);
        jest.spyOn(txManager, 'execute').mockImplementation(async (cb: any) => await cb());

        // 2. Mockeamos el contexto de transacciones
        jest.spyOn(transactionContext, 'getStore').mockReturnValue(undefined);

        // 3. Estado Base (Happy Path):
        // findOne devuelve una carpeta sin hijos
        mockearMongooseFindOne({ _id: new Types.ObjectId(mockId), componentes: [] });
        mockearMongooseUpdateMany();
        mockearMongooseDeleteOne(1); // 1 = count de documentos eliminados (Repo retorna true)
        
        componenteRepoMock.eliminar.mockResolvedValue(true);
        if (documentoService) {
            documentoService.deleteDocumento = jest.fn<any>().mockResolvedValue(true);
        }
    });

    // Helper robusto para atrapar y evaluar excepciones sin ejecutar el controller 2 veces
    const verificarRpcException = async (promesa: Promise<any>, mensajeEsperado: string) => {
        let errorAtrapado: any;
        try {
            await promesa;
        } catch (e) {
            errorAtrapado = e;
        }
        expect(errorAtrapado).toBeDefined();
        expect(errorAtrapado).toBeInstanceOf(RpcException);
        // Accedemos a la estructura del RpcException generada por NestJS
        const mensajeReal = errorAtrapado.getError()?.message || errorAtrapado.message;
        expect(mensajeReal).toContain(mensajeEsperado);
    };

    it("1. debería eliminar la carpeta correctamente sin hijos (Happy Path)", async () => {
        const resultado = await controller.eliminar({ id: mockId });

        // Verificamos que Mongoose recibió las llamadas exactas desde tu Repo
        expect(CarpetaModel.findOne).toHaveBeenCalledWith({ _id: new Types.ObjectId(mockId) });
        expect(CarpetaModel.updateMany).toHaveBeenCalledWith(
            { componentes: new Types.ObjectId(mockId) },
            { $pull: { componentes: new Types.ObjectId(mockId) } }
        );
        expect(componenteRepoMock.eliminar).toHaveBeenCalledWith(mockId);
        expect(CarpetaModel.deleteOne).toHaveBeenCalledWith({ _id: new Types.ObjectId(mockId) });
        
        expect(resultado).toEqual({success: true});
    });

    it("2. debería eliminar recursivamente los componentes hijos (subcarpetas y documentos)", async () => {
        const idSubCarpeta = new Types.ObjectId().toString();
        const idDocumento = new Types.ObjectId().toString();

        // FIX: Mock inteligente que corta el bucle infinito
        jest.spyOn(CarpetaModel, 'findOne').mockImplementation((filtro: any) => {
            const idBuscado = filtro._id.toString();
            let resultado = null;

            if (idBuscado === mockId) {
                // Si buscan el padre, devolvemos la lista de hijos
                resultado = { _id: new Types.ObjectId(mockId), componentes: [new Types.ObjectId(idSubCarpeta), new Types.ObjectId(idDocumento)] };
            } else {
                // Si buscan la subcarpeta, devolvemos un array vacío para frenar la recursión
                resultado = { _id: new Types.ObjectId(idBuscado), componentes: [] };
            }

            return {
                session: () => ({ lean: () => ({ exec: async () => resultado }) })
            } as any;
        });

        componenteRepoMock.obtenerPorId.mockImplementation(async (id: string) => {
            if (id === idSubCarpeta) return { getId: () => idSubCarpeta, getTipo: () => "carpeta" } as any;
            if (id === idDocumento) return { getId: () => idDocumento, getTipo: () => "documento" } as any;
            return null;
        });

        await controller.eliminar({ id: mockId });

        expect(documentoService.deleteDocumento).toHaveBeenCalledWith(idDocumento);
        expect(CarpetaModel.updateMany).toHaveBeenCalledTimes(2);
        expect(CarpetaModel.deleteOne).toHaveBeenCalledTimes(2);
    });

    it("3. debería lanzar RpcException si falla la eliminación en ComponenteRepository (retorna false)", async () => {
        // Tu Service lanza un Error si el componente retorna false
        componenteRepoMock.eliminar.mockResolvedValue(false);

        await verificarRpcException(
            controller.eliminar({ id: mockId }),
            `No se pudo eliminar el componente ${mockId}`
        );

        // Se aborta antes de llegar al delete de la carpeta
        expect(CarpetaModel.deleteOne).not.toHaveBeenCalled();
    });

    it("4. debería lanzar RpcException si Mongoose no elimina ninguna carpeta (deletedCount: 0 -> false)", async () => {
        // Repo transforma deletedCount 0 en `false`. El Service lo atrapa y lanza Error.
        mockearMongooseDeleteOne(0);

        await verificarRpcException(
            controller.eliminar({ id: mockId }),
            `No se pudo eliminar la carpeta ${mockId}`
        );
    });

    it("5. debería lanzar RpcException si Mongoose falla (throw Error) al buscar la carpeta", async () => {
        mockearMongooseFindOne(null, new Error("Conexión perdida con MongoDB"));

        await verificarRpcException(
            controller.eliminar({ id: mockId }),
            "Conexión perdida con MongoDB"
        );
        
        // Todo el resto se aborta
        expect(CarpetaModel.updateMany).not.toHaveBeenCalled();
        expect(CarpetaModel.deleteOne).not.toHaveBeenCalled();
    });

    it("6. debería lanzar RpcException si el DocumentoService falla al borrar un hijo", async () => {
        const idDocumento = new Types.ObjectId().toString();
        
        mockearMongooseFindOne({ 
            _id: new Types.ObjectId(mockId), 
            componentes: [new Types.ObjectId(idDocumento)] 
        });

        componenteRepoMock.obtenerPorId.mockResolvedValue({ getId: () => idDocumento, getTipo: () => "documento" } as any);
        
        // Simulamos que falla el borrado del hijo
        documentoService.deleteDocumento.mockResolvedValue(false);

        // El Service lanza Error al no poder borrar el hijo
        await verificarRpcException(
            controller.eliminar({ id: mockId }),
            `Error al borrar el documento ${idDocumento}`
        );

        // Se aborta todo el flujo posterior
        expect(CarpetaModel.updateMany).not.toHaveBeenCalled();
        expect(CarpetaModel.deleteOne).not.toHaveBeenCalled();
    });
    it("7. debería lanzar RpcException si Mongoose tira error al borrar la relación del padre (updateMany)", async () => {
        // Simulamos que la BD explota justo al hacer updateMany (borrarComponenteEnPadre)
        mockearMongooseUpdateMany(new Error("Timeout actualizando la carpeta padre"));

        await verificarRpcException(
            controller.eliminar({ id: mockId }),
            "Timeout actualizando la carpeta padre"
        );

        // Verificamos que abortó antes de eliminar físicamente el componente y la carpeta
        expect(componenteRepoMock.eliminar).not.toHaveBeenCalled();
        expect(CarpetaModel.deleteOne).not.toHaveBeenCalled();
    });

    it("8. debería lanzar RpcException si Mongoose lanza una excepción real al eliminar la carpeta (deleteOne)", async () => {
        // A diferencia del caso donde devuelve deletedCount: 0, aquí Mongoose crashea (Ej. se cae la red)
        mockearMongooseDeleteOne(0, new Error("Crash de MongoDB en deleteOne"));

        await verificarRpcException(
            controller.eliminar({ id: mockId }),
            "Crash de MongoDB en deleteOne"
        );
    });

    it("9. debería lanzar RpcException si el ComponenteRepository lanza una excepción inesperada", async () => {
        // A diferencia del caso donde devuelve `false`, aquí la BD relacional crashea
        componenteRepoMock.eliminar.mockRejectedValue(new Error("Fallo de conexión SQL al eliminar componente"));

        await verificarRpcException(
            controller.eliminar({ id: mockId }),
            "Fallo de conexión SQL al eliminar componente"
        );

        // Se detuvo antes de borrar la carpeta en Mongo
        expect(CarpetaModel.deleteOne).not.toHaveBeenCalled();
    });

    it("10. debería lanzar RpcException si falla la eliminación recursiva de una subcarpeta", async () => {
        const idSubCarpeta = new Types.ObjectId().toString();

        // FIX: Mock inteligente para el test 10
        jest.spyOn(CarpetaModel, 'findOne').mockImplementation((filtro: any) => {
            const idBuscado = filtro._id.toString();
            const resultado = idBuscado === mockId 
                ? { _id: new Types.ObjectId(mockId), componentes: [new Types.ObjectId(idSubCarpeta)] }
                : { _id: new Types.ObjectId(idBuscado), componentes: [] };

            return {
                session: () => ({ lean: () => ({ exec: async () => resultado }) })
            } as any;
        });

        componenteRepoMock.obtenerPorId.mockResolvedValueOnce({ 
            getId: () => idSubCarpeta, 
            getTipo: () => "carpeta" 
        } as any);

        // Simulamos que al hacer el deleteOne, la base de datos falla al intentar borrar la subcarpeta
        let llamadasDelete = 0;
        jest.spyOn(CarpetaModel, 'deleteOne').mockImplementation(() => {
            llamadasDelete++;
            // Falla en el primer deleteOne físico (que corresponde a la subcarpeta al finalizar la recursión)
            const count = llamadasDelete === 1 ? 0 : 1; 
            return { session: () => ({ exec: async () => ({ deletedCount: count }) }) } as any;
        });

        await verificarRpcException(
            controller.eliminar({ id: mockId }),
            `No se pudo eliminar la carpeta ${idSubCarpeta}`
        );
    });
});