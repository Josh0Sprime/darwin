

export interface RespuestaEvolucion{
    diagnostico: string;
    evolucion: string;
    fecha_alta: string;
    fecha_registro: string;
    id: number;
    id_estado: number;
    id_medico: number;
    id_paciente: number;
    id_servicio: number;
    plan: number;
    ok?: boolean;
    estudios_complementarios: string;
}