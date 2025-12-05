import { registros } from "./registros.model";

export class Paciente {
    id: number = 0;

    // Identificación
    tipo_paciente: String = "";
    curp: String = "";
    nombre: String = "";
    fecha_nacimiento: Date = new Date();
    sexo: number = 0;
    estado_civil: String = "";
    origen: String = "";

    // Contacto y Ubicación
    telefono: String = "";
    email: String = "";
    calle: String = "";
    numero_exterior: String = "";
    numero_interior: String = "";
    colonia: String = "";
    cp: String = "";
    municipio: String = "";
    entidad_federativa: String = "";
    residencia: String = ""; // Keep for backward compatibility if needed

    // Responsable
    nombre_responsable: String = "";
    parentesco_responsable: String = "";
    telefono_responsable: String = "";
    direccion_responsable: String = "";

    // Estudiante
    matricula: String = "";
    facultad: String = "";
    programa_educativo: String = "";
    semestre: number = 0;
    grupo: number = 0; // Changed to number based on usage, or String if mixed

    // Trabajador
    numero_personal: String = "";
    puesto: String = "";
    facultad_adscripcion: String = "";
    tipo_contratacion: String = "";

    // Seguridad Social
    nss: String = "";

    // Sociodemográfico
    ocupacion: String = "";
    religion: String = "";
    escolaridad: String = "";
    // habla_lengua_indigena: boolean = false;
    lengua_indigena: String = "";

    activo: boolean = true;
    fecha_creacion: Date = new Date();
    registros: registros[] = [];
}