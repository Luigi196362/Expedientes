import { Paciente } from "../../pacientes/models/paciente.model";
import { Usuario } from "../../usuarios/models/usuario.model";

export class Registro {
    id: number = 0;
    usuario: String = "";
    paciente: String = "";
    fecha_creacion: Date = new Date();
    tipo_registro: String = "";
}