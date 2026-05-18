import {Types} from "mongoose";
export interface IDocumentoScheme {
    _id: Types.ObjectId;
    estado: string;
    version: string;
   }