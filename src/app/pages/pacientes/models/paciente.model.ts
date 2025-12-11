import { registros } from "./registros.model";

export class Paciente {
    id: number = 0;

    // Identificación
    tipo_paciente: String = "";
    curp: String = "";
    nombre: String = "";
    fecha_nacimiento: Date = new Date();
    sexo: String = "";
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
    calle_responsable: String = "";
    numero_exterior_responsable: String = "";
    numero_interior_responsable: String = "";
    colonia_responsable: String = "";
    cp_responsable: String = "";
    municipio_responsable: String = "";
    entidad_federativa_responsable: String = "";

    // Estudiante
    matricula: String = "";
    facultad: String = "";
    programa_educativo: String = "";
    semestre: number = 0;
    grupo: number = 0; // Changed to number based on usage, or String if mixed

    // Trabajador
    numero_personal: String = "";
    puesto: String = "";
    tipo_contratacion: String = "";

    // Seguridad Social
    nss: String = "";

    // Sociodemográfico
    religion: String = "";
    escolaridad: String = "";
    // habla_lengua_indigena: boolean = false;
    lengua_indigena: String = "";

    activo: boolean = true;
    fecha_creacion: Date = new Date();
    registros: registros[] = [];
}