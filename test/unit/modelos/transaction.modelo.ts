import { txManagerMock } from "../documentos/mocks/documento.repository.mock"

export const modeloTransacion =
    txManagerMock.execute.mockImplementation(
        async <T>(operacion: () => Promise<T>): Promise<T> => {
            return await operacion()
        }
    )