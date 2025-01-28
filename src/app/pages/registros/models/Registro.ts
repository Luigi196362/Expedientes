import { Paciente } from "../../pacientes/models/paciente.model";
import { Usuario } from "../../usuarios/models/usuario.model";

export class Registro {
    id: number = 0;
    usuario: Usuario = new Usuario();
    paciente: Paciente = new Paciente();
    fecha_creacion: Date = new Date();
}