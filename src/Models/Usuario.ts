import { ObjectId } from "mongodb";
import type { Types } from "mongoose";
export class Usuario {
    private _id: ObjectId;
    private nombre: string;
    private apellido: string;
    private email: string;
    private username: string;
    private password: string;
    private fechaCreacion: Date;

    constructor(id:Types.ObjectId, nombre: string, apellido: string, email: string, username: string, password: string) {
        this._id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.username = username;
        this.password = password;
        this.fechaCreacion = new Date();
    }

    getId(): Types.ObjectId {
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

}