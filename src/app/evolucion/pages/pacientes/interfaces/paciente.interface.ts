export interface Paciente{
    id                   : number;
    run                  : string;
    pasaporte?           : string;
    nombres              : string;
    apellidos            : string;
    fecha_nacimiento     : string;
    genero?              : string;
    fecha_ingreso?       : string;
    dias_hospitalizacion?: number | string;
    estado_paciente?     : string;
}