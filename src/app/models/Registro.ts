import { Paciente } from "./Paciente";
import { Usuario } from "./Usario";

export class Registro {
    id: number = 0;
    usuario: Usuario = new Usuario();
    paciente: Paciente = new Paciente();
    fecha_creacion: Date = new Date();
}