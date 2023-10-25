const { response, request } = require('express');
const jwt = require('jsonwebtoken');


const validarToken = ( req = request, res = response, next ) => {
    const token = req.header('token');
    try {
        if(!token || token === '' || token === undefined){
            return res.json({
                ok: false,
                msg: "Token invalido"
            })
        }
        const validarTk = jwt.verify(token, process.env.JWT);
        req.usuario = validarTk.usuario;
        req.nombre = validarTk.nombres;
        req.apellidos = validarTk.apellidos;
        req.id_usuario = validarTk.id_usuario;
        req.rol = validarTk.rol;
        next();
        
    } catch (error) {
        return res.json({
            ok: false,
            msg: "Error en el token"
        })
    }

}




module.exports = {validarToken};