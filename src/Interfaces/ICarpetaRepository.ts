export interface ICarpetaCacheRepository {
    findByCacheKey(cacheKey: string): Promise<any | null>;
    upsert(cacheKey: string, idUsuario: string, data: any, ttlSeconds: number): Promise<void>;
    deleteByUsuario(idUsuario: string): Promise<void>;
    clearAll(): Promise<void>;
}