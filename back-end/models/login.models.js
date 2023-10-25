const {conexionDB} = require("../db/conexion.js");
const bcrypt = require('bcryptjs');

const validarUsuarioDB = ( usuario, password ) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT medico.id, usuario.nombre_usuario, usuario.id_rol, medico.nombres, medico.apellidos, usuario.id_estado, usuario.clave FROM usuario INNER JOIN medico ON usuario.nombre_usuario = medico.run WHERE usuario.nombre_usuario = '${usuario}'`;
        conexionDB.query(sql, (err, resultado) => {
            if(err){
                return reject({
                    ok: false,
                    msg: "usuario o contraseña no valido"
                });
            }
            if(resultado.length <= 0){
                return reject({
                    ok: false,
                    msg: "usuario o contraseña no valido"
                });
            }
            const respHash = bcrypt.compareSync(password, resultado[0]["clave"]);
            if(respHash){
                return resolve({
                    ok: true,
                    msg: "usuario autorizado",
                    resultado
                });
            }
            return reject({
                ok: false,
                msg: "usuario o contraseña no valido"
            });
        });
    });
}




module.exports = {
    validarUsuarioDB,
}