export interface Medico{
    id: number;
    run: string;
    pasaporte: string;
    nombres: string;
    apellidos: string;
    estado: string;
    identificador?: string;
}

export interface EstadoMedico{
    id: number;
    nombre: string;
    nombre_usuario: string;
    nombre_contrario?: string;
    id_contrario?: number;
}

export interface DatosMedico{
    id: number;
    run: string;
    nombres: string;
    apellidos: string;
    pasaporte: string;
    id_rol: number;
}