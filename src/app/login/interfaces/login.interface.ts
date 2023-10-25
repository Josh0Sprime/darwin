

export interface Login{
    ok: boolean;
    token: string;
    nombre: string;
    apellidos: string;
    id_usuario: number;
    rol: string;
}

export interface RespuestaUsuario{
    ok: boolean;
}