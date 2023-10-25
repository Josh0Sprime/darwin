const { response } = require("express");
const { crearUsuarioDB, obtenerMedicosDB, obtenerEstadoMedicoDB, cambiarEstadoMedicoDB, obtenerDatosMedicoModificar, modificarMedicoDB, obtenerRolesPacienteDB } = require("../models/medico");



const crearUsuario = async(req, res = response) => {
    const { password, run, nombres, apellidos, rol } = req.body;
    
    try {
        const resp = await crearUsuarioDB( password, run, nombres, apellidos, rol );
        if(resp.ok){
            return res.json({
                ok: true,
                msg: "Usuario creado"
            });
        }
        return res.json({
            ok: false,
            msg: "Error al crear usuario"
        });

    } catch (error) {
        return res.json({
            ok: false,
            error
        });
    }
}

const obtenerRoles = async( req = request, res = response ) => {

    try {
        const resp = await obtenerRolesPacienteDB();
        if(resp.ok){
            return res.json(resp.resultado)
        }
        return res.json(resp.resultado)
    } catch (error) {
        return res.json(error.resultado)
    }
}

const obtenerMedicos = async(req, res = response) => {
    try {
        const resp = await obtenerMedicosDB();
        if(resp.ok){
            return res.json(resp.resultado)
        }
        return res.json({
            ok: false
        })
    } catch (error) {
        return res.json({
            ok: false,
            error
        })
    }
}

const obtenerEstadoMedico = async(req, res = response) => {
    try {
        const { run } = req.body;
        const resp = await obtenerEstadoMedicoDB( run )
        if(resp.ok){
            return res.json(resp.resultado)
        }
        return res.json({
            ok: false
        })
    } catch (error) {
        return res.json({
            ok: false
        })
    }
}

const cambiarEstadoMedico = async(req, res = response) => {
    try {
        const { id_estado, run } = req.body;

        const resp = await cambiarEstadoMedicoDB(id_estado, run);
        if(resp){
            return res.json({
                ok: true,
                msg: "Estado de medico cambiado"
            })
        }
        return res.json({
            ok: false
        })
    } catch (error) {
        return res.json({
            ok: false
        })
    }
}

const obtenerDatosMedico = async(req, res = response) => {
    try {
        const { id_medico } = req.body;

        const resp = await obtenerDatosMedicoModificar(id_medico);
        if(resp.ok){
            return res.json(resp.resultado)
        }
        return res.json({
            ok: false
        })
    } catch (error) {
        return res.json({
            ok: false
        })
    }
}

const modificarMedico = async(req, res = response) => {
    try {
        const { nombres, apellidos, id_medico, id_estado, run_usuario, id_rol } = req.body;
        const resp = await modificarMedicoDB(nombres, apellidos, id_medico, id_estado, run_usuario, id_rol);
        if(resp.ok){
            return res.json({
                ok: true
            })
        }
        return res.json({
            ok: false
        })
    } catch (error) {
        return res.json({
            ok: false
        })
    }
}


module.exports = {
    crearUsuario,
    obtenerMedicos,
    obtenerEstadoMedico,
    cambiarEstadoMedico,
    obtenerDatosMedico,
    modificarMedico,
    obtenerRoles
}