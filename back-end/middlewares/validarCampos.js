const { response, request, json } = require("express");
const jwt = require('jsonwebtoken');



const validarCamposLogin = (req, res = response, next) => {
    const { usuario, password } = req.body;

    if(!usuario || usuario === '' || usuario === undefined || !password || password === '' || password === undefined){
        return res.json({
            ok: false,
            msg: "Error en uno de los campos"
        })
    }
    next();
}

const validarCamposCrearUsuario = (req, res = response, next) => {
    const { password, run, nombres, apellidos, rol } = req.body;

    if(!password || password === '' || password === undefined || !run || run === '' || run === undefined ||
    !nombres || nombres === '' || nombres === undefined || 
    !apellidos || apellidos === '' || apellidos === undefined || !rol || rol === '' || rol === undefined){
        return res.json({
            ok: false,
            msg: "Error en uno de los campos"
        })
    }
    next();
}

const validarCamposRunMedico = (req, res = response, next) => {
    const { run } = req.body;

    if(!run || run === '' || run === undefined){
        return res.json({
            ok: false,
            msg: "Error en uno de los campos"
        })
    }
    next();
}

const validarCamposEstadoMedico = (req, res = response, next) => {
    const { id_estado, run } = req.body;

    if(!id_estado || id_estado === '' || id_estado === undefined || !run || run === '' || run === undefined){
        return res.json({
            ok: false,
            msg: "Error en uno de los campos"
        })
    }
    next();
}

const validarCamposObtenerDatosMedicos = (req, res = response, next) => {
    const { id_medico } = req.body;

    if(!id_medico || id_medico === '' || id_medico === undefined){
        return res.json({
            ok: false,
            msg: "Error en uno de los campos"
        })
    }
    next();
}

const validarCamposModificar = (req, res = response, next) => {
    const { nombres, apellidos, id_medico, id_estado, run_usuario, id_rol } = req.body;

    if(!nombres || nombres === '' || nombres === undefined || !apellidos || 
        apellidos === '' || apellidos ===  undefined || !id_medico || id_medico === '' || 
        id_medico === undefined || !id_estado || id_estado === '' || id_estado ===  undefined ||
        !run_usuario || run_usuario === '' || run_usuario === undefined || !id_rol ||
        id_rol === '' || id_rol === undefined){
            return res.json({
                ok: false,
                msg: "Error en uno de los campos"
            })
        }

        next();
}

const validarTokenSolicitud = (req, res = response, next) => {
    try {
        const { token } = req.body;
        if(!token || token === '' || token === undefined) {
            return res.json({
                ok: false,
                msg: "Error en el token"
            })
        }
        
        jwt.verify(token, process.env.JWT);
        next();
        
    } catch (error) {
        return res.json({
            ok: false,
            msg: "Error en el token"
        })
    }
}

const validarTokenSolicitudHeader = (req = request, res = response, next) => {
    try {
        
       const token = req.header('token');
    
        if(!token || token === '' || token === undefined) {
            return res.json({
                ok: false,
                msg: "Error en el token"
            })
        }
        
        jwt.verify(token, process.env.JWT);
        next();
        
    } catch (error) {
        return res.json({
            ok: false,
            msg: "Error en el token"
        })
    }
}

const validarCamposAgregarPaciente = ( req, res = response, next) => {

    const {run, nombres, apellidos, fecha_nacimiento, genero, fecha_ingreso} = req.body;

    if( !run || !nombres || !apellidos || !fecha_nacimiento || !genero || !fecha_ingreso || 
        run === undefined || nombres === undefined || apellidos === undefined || 
        fecha_nacimiento === undefined || genero === undefined || fecha_ingreso === undefined ){
            return res.json({
                ok:false,
                msg: "Error en los campos"
            })
    }
    next();

}

const validarCamposAgregarEvolucion = (req, res = response, next) => {
    const { id_paciente, id_medico, id_servicio, diagnostico, evolucion, plan, fecha_alta, estudio_complementario, participacion_interno, nombre_interno } = req.body;
    if(!id_paciente || id_paciente === '' ||
    id_paciente === undefined || !id_medico || id_medico === '' || id_medico === undefined || !id_servicio || 
    id_servicio === '' || id_servicio === undefined || !diagnostico || diagnostico === '' || diagnostico === undefined ||
    !evolucion || evolucion === '' || evolucion === undefined || !plan || plan === '' || plan === undefined || 
    !fecha_alta || fecha_alta === '' | fecha_alta === undefined || !estudio_complementario || estudio_complementario === '' ||
    estudio_complementario === undefined || participacion_interno === '' || participacion_interno === undefined || 
    nombre_interno === undefined){
        return res.json({
            ok: false,
            msg: "Error en uno de los campos"
        })
    }
    next();
}


const validarIdEvolucion = ( req, res = response, next ) => {
    const { id_evolucion, diagnostico, evolucion, estudio_complementario, plan } = req.body;
    if( !id_evolucion || id_evolucion === '' || id_evolucion === undefined || !diagnostico || 
    diagnostico === '' || diagnostico === '' || !evolucion || evolucion === '' || evolucion === undefined || 
    !estudio_complementario || estudio_complementario === '' || estudio_complementario === undefined || !plan || plan === '' || plan === undefined){
        return res.json({
            ok: false,
            msg: "Error en uno de los campos"
        })
    }
    next();
}

const validarIdEvolucionActual = ( req, res = response, next ) => {

    const { id_evolucion } = req.body;

    if(!id_evolucion || id_evolucion === '' || id_evolucion === undefined){
        return res.json({
            ok: false,
            msg: "Error en uno de los campos"
        })
    }
    next();
}


const validarCampoIdPaciente = ( req = request, res = response, next ) => {
    const { idPaciente } = req.body;
    if(!idPaciente || idPaciente === '' || idPaciente === undefined){
        return res.json({
            ok: false,
            msg: "Error en uno de los campos"
        })
    }
    next();
}

const validarCampoEpisodio = ( req = request, res = response, next ) => {
    const { Episodio } = req.body;
    if(!Episodio || Episodio === '' || Episodio === undefined){
        return res.json({
            ok: false,
            msg: "Error en el episodio"
        })
    }
    next();
}


const validarCampoRunPaciente = ( req = request, res = response, next ) => {
    const { run } = req.body;
    if(!run || run === '' || run === undefined){
        return res.json({
            ok: false,
            msg: "Error en uno de los campos"
        })
    }
    next();
}

const validarCampoIdServicio = ( req = request, res = response, next ) => {
    const { idServicio } = req.body;
    if(!idServicio || idServicio === '' || idServicio === undefined){
        return res.json({
            ok: false,
            msg: "Error en uno de los campos"
        })
    }
    next();
}


module.exports = {
    validarCamposLogin,
    validarCamposCrearUsuario,
    validarCamposRunMedico,
    validarCamposEstadoMedico,
    validarCamposObtenerDatosMedicos,
    validarCamposModificar,
    validarTokenSolicitud,
    validarTokenSolicitudHeader,
    validarCamposAgregarEvolucion,
    validarCampoIdPaciente,
    validarCamposAgregarPaciente,
    validarCampoRunPaciente,
    validarCampoEpisodio,
    validarIdEvolucion,
    validarCampoIdServicio,
    validarIdEvolucionActual
}