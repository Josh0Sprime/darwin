const { response } = require("express");
const crearJWT = require("../middlewares/jwt");
const { validarUsuarioDB, crearUsuarioDB } = require("../models/login.models");


const validarUsuario = async(req, res = response) => {
    const { usuario, password } = req.body;
    try {
        const resp = await validarUsuarioDB(usuario, password);
        const nombre = resp.resultado[0].nombres;
        const apellidos = resp.resultado[0].apellidos;
        const rol = resp.resultado[0].id_rol;
        const id_usuario = resp.resultado[0].id;
        const token = await crearJWT(usuario, nombre, apellidos, id_usuario, rol);
        
        if(resp.ok){
            if(resp.resultado[0].id_estado == 1){
                return res.json({
                    ok: true,
                    token,
                    nombre,
                    apellidos,
                    id_usuario,
                    rol
                });
            }
            return res.json({
                ok: false
            })
        }
        return res.json({
            ok: false
        });

    } catch (error) {
        res.json({
            ok: false,
            error
        });
    }
}



const renovarTk = async( req, res = response ) => {
    try {
        const { usuario, nombre, apellidos, id_usuario, rol } = req;
        const token = await crearJWT(usuario, nombre, apellidos, id_usuario, rol);
        return res.json({
            ok: true,
            token,
            nombre,
            apellidos,
            id_usuario,
            rol
        })
    } catch (error) {
        return res.json({
            ok: false,
            msg: "Error al renovar token"
        })
    }
    
}



module.exports = {
    validarUsuario,
    renovarTk
}