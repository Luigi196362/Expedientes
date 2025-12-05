export class Usuario {
    id: number = 0;
    username: String = "";
    nombre: String = "";
    curp: String = "";
    rfc: String = "";
    cedulaProfesional: String = "";
    especialidad: String = "";
    telefono: String = "";
    facultad: String = "";
    password: String = "";
    rolId: number = 0;
    rolNombre: String = "";
    fecha_creacion: Date = new Date();
    pasante: boolean = false;
}