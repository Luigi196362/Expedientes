export class Historia_clinica {
    id: number = 0;

    motivo_consulta: String = "";
    interrogatorio: String = "";
    padecimiento_actual: String = "";
    exploracion_fisica: String = "";

    peso: number = 0;
    talla: number = 0;
    imc: number = 0;
    tension_arterial: String = "";
    frecuencia_cardiaca: number = 0;
    frecuencia_respiratoria: number = 0;
    temperatura: number = 0;
    saturacion: number = 0;
    glicemia: number = 0;
    hemoglobina: number = 0;
    hemotipo: String = "";

    antecedentes_heredo_familiares: String = "";
    antecedentes_no_patologicos: String = "";
    antecedentes_patologicos: String = "";
    antecedentes_quirurgicos: String = "";
    medicamentos_actuales: String = "";
    alergias: String = "";
    antecedentes_gineco_obstetricos: String = "";
    cancer_prostata: String = "";
    vacunas: String = "";
    adicciones: String = "";

    diagnostico: String = "";
    tratamiento: String = "";
    plan_tratamiento: String = "";
    observaciones: String = "";
    fecha_creacion: Date = new Date();
}
