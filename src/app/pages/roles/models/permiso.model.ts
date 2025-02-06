import { Accion } from "./accion.model";

export class Permiso {
    id: number = 0;
    recurso: String = "";
    acciones: Accion[] = [];
}