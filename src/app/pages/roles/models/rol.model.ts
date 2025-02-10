import { Permiso } from "./permiso.model";

export class Rol {
    id: number = 0;
    nombre: String = "";
    descripcion: String = "";
    permisos: Permiso[] = [];
}