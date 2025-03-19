import { Registro } from "./Registro";

export class Historia_clinica {
    id: number = 0;
    //registro: Registro = new Registro;
    antecedentes_heredo_familiares: String = "";
    antecedentes_personales_no_patologicos: String = "";
    antecedentes_personales_patologicos: String = "";
    medicamentos_actuales: String = "";
    diagnostico_inicial: String = "";
    tratamiento: String = "";
    observaciones: String = "";
    alergias: String = "";
}