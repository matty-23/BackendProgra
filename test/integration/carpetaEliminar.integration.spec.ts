import { beforeEach, describe, it, expect, jest } from '@jest/globals';
import { CarpetaController } from '../../src/Controller/CarpetaController';
import { JwtGrpcAuthGuard } from '../../src/Guards/JwtAuthGuard';
import { module } from "./mocks/moduleMock";
import { componenteRepoMock } from '../unit/documentos/mocks/documento.repository.mock';
import { mockComponente, mockCarpetaMongo, mockId } from "./modelos/componente";
import { CarpetaModel } from '../../src/Database/Schemes/CarpetaScheme';
import { transactionContext } from '../../src/Database/TransactionContext';
import { Types } from "mongoose";

describe("Tests de integración de Carpeta Eliminar", () => {
    let controller: CarpetaController;
    let guard: JwtGrpcAuthGuard;

    // Helper para mockear la validación de existencia: findOne().session().lean().exec()
    const mockearMongooseFindOne = (resultado: any, error?: Error) => {
        const execMock = error ? jest.fn<any>().mockRejectedValue(error) : jest.fn<any>().mockResolvedValue(resultado);
        const leanMock = jest.fn<any>().mockReturnValue({ exec: execMock });
        const sessionMock = jest.fn<any>().mockReturnValue({ lean: leanMock });
        jest.spyOn(CarpetaModel, 'findOne').mockReturnValue({ session: sessionMock } as any);
    };

    // Helper para mockear la eliminación en MongoDB: deleteOne().session().exec()
    const mockearMongooseDeleteOne = (deletedCount: number, error?: Error) => {
        const execMock = error ? jest.fn<any>().mockRejectedValue(error) : jest.fn<any>().mockResolvedValue({ deletedCount });
        const sessionMock = jest.fn<any>().mockReturnValue({ exec: execMock });
        jest.spyOn(CarpetaModel, 'deleteOne').mockReturnValue({ session: sessionMock } as any);
    };

    beforeEach(async () => {
        jest.clearAllMocks(); // Limpiamos el estado entre tests
        
        controller = module.get<CarpetaController>(CarpetaController);
        guard = module.get<JwtGrpcAuthGuard>(JwtGrpcAuthGuard);
        
        // Configuraciones base (Happy Path)
        componenteRepoMock.obtenerPorId.mockResolvedValue(mockComponente);
        componenteRepoMock.eliminar.mockResolvedValue(true); // Asumiendo que retorna boolean
        jest.spyOn(transactionContext, 'getStore').mockReturnValue(undefined);

        mockearMongooseFindOne(mockCarpetaMongo);
        mockearMongooseDeleteOne(1); // 1 = se eliminó un documento
    });

    it("1. debería eliminar la carpeta correctamente (Happy Path)", async () => {
        // En tu controller, asumo que recibe un DTO o un objeto con { id: mockId }
        const resultado = await controller.eliminar({ id: mockId });

        // Verificamos que se ejecutó la eliminación en ambas bases de datos
        expect(CarpetaModel.deleteOne).toHaveBeenCalledWith({ _id: new Types.ObjectId(mockId) });
        // Verificamos que llamó a eliminar en el repositorio de componentes
        expect(componenteRepoMock.eliminar).toHaveBeenCalledWith(mockId);
        
        // El resultado debería ser exitoso
        expect(resultado).toBe(true); 
    });

    it("2. debería devolver false si el Componente base no existe", async () => {
        componenteRepoMock.obtenerPorId.mockResolvedValue(null);

        const resultado = await controller.eliminar({ id: mockId });

        expect(resultado).toBe(false);

        // Verificamos que no se intentó eliminar nada
        expect(CarpetaModel.deleteOne).not.toHaveBeenCalled();
        expect(componenteRepoMock.eliminar).not.toHaveBeenCalled();
    });

    it("3. debería devolver false si la Carpeta no existe en MongoDB", async () => {
        mockearMongooseFindOne(null);

        const resultado = await controller.eliminar({ id: mockId });

        expect(resultado).toBe(false);

        // Verificamos que no se intentó eliminar nada
        expect(CarpetaModel.deleteOne).not.toHaveBeenCalled();
        expect(componenteRepoMock.eliminar).not.toHaveBeenCalled();
    });

    it("4. debería fallar si la validación del Componente falla (BD de componentes caída)", async () => {
        componenteRepoMock.obtenerPorId.mockRejectedValue(new Error("Timeout en Base de Datos SQL"));

        await expect(controller.eliminar({ id: mockId })).rejects.toThrow("Timeout en Base de Datos SQL");
        
        expect(CarpetaModel.deleteOne).not.toHaveBeenCalled();
    });

    it("5. debería fallar si la validación de la Carpeta falla (Mongoose arroja error en findOne)", async () => {
        mockearMongooseFindOne(null, new Error("Error de conexión Mongoose"));

        await expect(controller.eliminar({ id: mockId })).rejects.toThrow("Error de conexión Mongoose");
        
        expect(CarpetaModel.deleteOne).not.toHaveBeenCalled();
    });

    it("6. debería devolver false si Mongoose devuelve deletedCount: 0", async () => {
        // Esto ocurre si la carpeta existía en la validación inicial pero fue eliminada por otro proceso 
        // una fracción de segundo antes del deleteOne
        mockearMongooseDeleteOne(0);

        const resultado = await controller.eliminar({ id: mockId });

        // Tu Repositorio retorna: return resultado.deletedCount === 1; 
        // Si es 0, el repo retorna false, por lo que el Service debería retornar false
        expect(resultado).toBe(false);
    });

    it("7. debería fallar si Mongoose arroja un error al ejecutar deleteOne", async () => {
        mockearMongooseDeleteOne(0, new Error("Fallo al escribir en MongoDB"));

        await expect(controller.eliminar({ id: mockId })).rejects.toThrow("Fallo al escribir en MongoDB");
    });

    it("8. debería fallar si hay un error al eliminar el Componente", async () => {
        // Mongoose elimina la carpeta bien, pero el componente en BD falla
        componenteRepoMock.eliminar.mockRejectedValue(new Error("Error al eliminar relación del componente"));

        await expect(controller.eliminar({ id: mockId })).rejects.toThrow("Error al eliminar relación del componente");

        // Ojo: En una transacción real esto haría rollback. 
        // Validamos que al menos Mongoose intentó ejecutarse (ya que suele ir antes o después dependiendo de tu Service)
        expect(CarpetaModel.deleteOne).toHaveBeenCalled();
    });
});