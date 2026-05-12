import { ObjectId } from "mongodb";
export class Usuario {
    private _id: number;
    private nombre: string;
    private apellido: string;
    private email: string;
    private username: string;
    private password: string;
    private idCarpetaRaiz: ObjectId;
    private fechaCreacion: Date;

    constructor(id: number, nombre: string, apellido: string, email: string, username: string, password: string, idCarpetaRaiz: ObjectId) {
        this._id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.username = username;
        this.password = password;
        this.idCarpetaRaiz = idCarpetaRaiz;
        this.fechaCreacion = new Date();
    }

    getId(): number {
        return this._id;
    }
    getNombre(): string {
        return this.nombre;
    }
    getApellido(): string {
        return this.apellido;
    }
    getEmail(): string {
        return this.email;
    }
    getUsername(): string {
        return this.username;
    }
    getPassword(): string {
        return this.password;
    }
    getIdCarpetaRaiz(): ObjectId {
        return this.idCarpetaRaiz;
    }
    getFechaCreacion(): Date {
        return this.fechaCreacion;
    }
    setNombre(nombre: string): void {
        this.nombre = nombre;
    }
    setApellido(apellido: string): void {
        this.apellido = apellido;
    }
    setEmail(email: string): void {
        this.email = email;
    }
    setUsername(username: string): void {
        this.username = username;
    }
    setPassword(password: string): void {
        this.password = password;
    }
    setIdCarpetaRaiz(idCarpetaRaiz: ObjectId): void {
        this.idCarpetaRaiz = idCarpetaRaiz;
    }

}