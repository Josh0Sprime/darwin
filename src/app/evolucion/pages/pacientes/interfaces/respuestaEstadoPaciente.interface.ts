

export interface EstadoEpisodioPaciente{
    ok: true,
    resp: [
        {
            episodio: number,
            id_paciente: number,
            fecha_inicio: string,
            fecha_termino: string,
            id_estado: number
        }
    ]
}