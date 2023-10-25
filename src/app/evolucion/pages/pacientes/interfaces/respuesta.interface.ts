
export interface Respuesta{
    ok:boolean,
    error?: {ok: boolean, apto: boolean}
}

export interface RespuestaAgregarPaciente{
    resp: {
        ok: boolean,
        msg: string
    }
}

export interface RespuestaEvolucionPaciente{
    ok: boolean;
    evoluciones: boolean
}

export interface RespuestaObtenerIdPaciente{
    ok: boolean,
    resultado: [
        {
            id_paciente: number
        }
    ]
}