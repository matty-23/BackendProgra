export interface IUsuarioService {
    getUsuarioById(id: string): Promise<any>;
    getUsuarioByUsername(username: string): Promise<any>;
    addUsuario(usuario: any): Promise<any>;
    updateUsuario(usuario: any): Promise<boolean>;
    deleteUsuario(id: string): Promise<boolean>;
}