import { beforeEach, jest } from '@jest/globals';
import { CarpetaModel } from '../../../src/Database/Schemes/CarpetaScheme';
export const mockDocumentoService = { obtenerDocumento: jest.fn() };


export const mockearMongooseFindOne = (resultado: any, error?: Error) => {
    const execMock = error ? jest.fn<any>().mockRejectedValue(error) : jest.fn<any>().mockResolvedValue(resultado);
    const leanMock = jest.fn<any>().mockReturnValue({ exec: execMock });
    const sessionMock = jest.fn<any>().mockReturnValue({ lean: leanMock });
    jest.spyOn(CarpetaModel, 'findOne').mockReturnValue({ session: sessionMock } as any);
};

export const mockearMongooseUpdate = (resultado: any, error?: Error) => {
    const execMock = error ? jest.fn<any>().mockRejectedValue(error) : jest.fn<any>().mockResolvedValue(resultado);
    const leanMock = jest.fn<any>().mockReturnValue({ exec: execMock });
    const populateMock = jest.fn<any>().mockReturnValue({ lean: leanMock });
    jest.spyOn(CarpetaModel, 'findByIdAndUpdate').mockReturnValue({ populate: populateMock } as any);
};



export const mockearMongooseUpdateMany = (error?: Error) => {
    const execMock = error ? jest.fn<any>().mockRejectedValue(error) : jest.fn<any>().mockResolvedValue({});
    const sessionMock = jest.fn<any>().mockReturnValue({ exec: execMock });
    jest.spyOn(CarpetaModel, 'updateMany').mockReturnValue({ session: sessionMock } as any);
};

export const mockearMongooseDeleteOne = (deletedCount: number, error?: Error) => {
    const execMock = error ? jest.fn<any>().mockRejectedValue(error) : jest.fn<any>().mockResolvedValue({ deletedCount });
    const sessionMock = jest.fn<any>().mockReturnValue({ exec: execMock });
    jest.spyOn(CarpetaModel, 'deleteOne').mockReturnValue({ session: sessionMock } as any);
};