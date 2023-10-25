export interface Evolucion{

    id: number, 
    fecha_registro: string,
    id_paciente:number,
    id_medico: number,
    run_medico?: string,
    nombres_medico?: string,
    apellidos_medico?: string,
    id_servicio: number,
    nombre_servicio?: string,
    diagnostico: string,
    evolucion: string,
    plan: string,
    fecha_alta: string,
    id_estado: number,
    nombre_estado: string;
    estudios_complementarios: string;
}