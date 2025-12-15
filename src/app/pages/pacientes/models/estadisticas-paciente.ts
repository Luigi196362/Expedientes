export interface EstadisticasPaciente {
    totalPacientes: number;
    totalNotas: number;
    porSexo: Record<string, number>;
    porFacultad: Record<string, number>;
    porProgramaEducativo: Record<string, number>;
    porSemestre: Record<string, number>;
    porTipoPaciente: Record<string, number>;
    porEstadoCivil: Record<string, number>;
    porLenguaIndigena: Record<string, number>;
    casosPorDiaMes: Record<string, number>;
    casosPorAnio: Record<string, number>;
    topSintomas: Record<string, number>;
}
