export class Nota_Evolucion {
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

    diagnostico: String = "";
    tratamiento: String = "";
    plan_tratamiento: String = "";
    observaciones: String = "";
    fecha_creacion: Date = new Date();
}