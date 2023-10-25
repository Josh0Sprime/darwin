const { conexionDB } = require("../db/conexion");
const bcrypt = require('bcryptjs');

const crearUsuarioDB = ( password, run, nombres, apellidos, rol ) => {
   
    return new Promise(( resolve, reject ) => {
        bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password);
        const sql = `select * from usuario where nombre_usuario = '${run}'`;
        conexionDB.query(sql, (err, resultado) => {
            if(resultado.length > 0){
                return reject({
                    ok: false,
                    msg: "Error al crear usuario"
                });
            }
            const sql2 = `select * from medico where run = '${run}'`;
            conexionDB.query(sql2, (err, resultado) => {
                if (resultado.length > 0){
                    return reject({
                        ok: false,
                        msg: "Error al crear usuario"
                    });
                }
                const sqlAgregarUsuario = `insert into usuario (nombre_usuario, clave, id_estado, id_rol) values ('${run}', '${hashPassword}', '1', '${rol}')`;

                conexionDB.query(sqlAgregarUsuario, (err, resultado) => {
                    if(err){
                        return reject({
                            ok: false,
                            msg: "Error al crear usuario"
                        });
                    }
                    const sqlAgregarMedico = `insert into medico (run, nombres, apellidos) values ('${run}', '${nombres}', '${apellidos}')`;
                    conexionDB.query(sqlAgregarMedico, (err, resultado) => {
                        if(err){
                            return reject({
                                ok: false,
                                msg: "Error al crear usuario"
                            });
                        }
                        return resolve({
                            ok: true,
                            msg: "Usuario creado"
                        });
                    });
                });
            });
        });
    });
}

const obtenerRolesPacienteDB  = () => {
    return new Promise((resolve, reject) => {
        const sql = "select * from rol_usuario";
        conexionDB.query(sql, (err, resultado) => {
            if(err){
                reject({
                    ok: false,
                    resultado
                })
            }
            return resolve({
                ok: true,
                resultado
            })
        })
    })
}

const obtenerMedicosDB = ( ) => {

    return new Promise((resolve, reject) => {
        const sql = "SELECT medico.run, medico.id, medico.nombres, medico.apellidos, estado_usuario.nombre AS estado FROM medico LEFT JOIN usuario ON medico.run = usuario.nombre_usuario LEFT JOIN estado_usuario ON usuario.id_estado = estado_usuario.id;"
        conexionDB.query(sql, (err, resultado) => {
            if(err){
                return reject({
                    ok: false
                })
            }
            return resolve({
                ok: true,
                resultado
            })
        })
    })

}

const obtenerEstadoMedicoDB = ( run ) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT estado_usuario.id, estado_usuario.nombre, usuario.nombre_usuario FROM estado_usuario INNER JOIN usuario ON estado_usuario.id = usuario.id_estado WHERE usuario.nombre_usuario = '${run}'`;
        conexionDB.query(sql, (err, resultado) => {
            if (err){
                return reject({
                    ok: false
                })
            }
            return resolve({
                ok: true,
                resultado
            })
        })
    })
}

const cambiarEstadoMedicoDB = ( id_estado, run ) => {
    return new Promise((resolver, reject) => {
        const sql = `UPDATE usuario SET usuario.id_estado = '${id_estado}' WHERE usuario.nombre_usuario = '${run}';`
        conexionDB.query(sql, (err, resultado) => {
            if(err){
                return reject({
                    ok: false
                })
            }
            return resolver({
                ok: true
            })
        })
    })
}

const obtenerDatosMedicoModificar = (id_medico) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT medico.id, medico.run, medico.nombres, medico.apellidos, usuario.id_rol FROM medico INNER JOIN usuario ON medico.run = usuario.nombre_usuario
        WHERE medico.id = '${id_medico}';`;
        conexionDB.query(sql, (err, resultado) => {
            if(err){
                return reject({
                    ok: false
                })
            }
            return resolve({
                ok: true,
                resultado
            })
        })
    })
}

const modificarMedicoDB = (nombres, apellidos, id_medico, id_estado, run_usuario, id_rol) => {
    return new Promise((resolve, reject) => {
        const sql = `update medico set medico.nombres = '${nombres}', medico.apellidos = '${apellidos}' where medico.id = '${id_medico}'`;
        conexionDB.query(sql, (err, resultado) => {
            if(err){
                return reject({
                    ok: false
                })
            }
            const sql2 = `update usuario set usuario.id_estado = '${id_estado}', id_rol = '${id_rol}' where usuario.nombre_usuario = '${run_usuario}'`;
            conexionDB.query(sql2, (err, resultado) => {
                if(err){
                    return reject({
                        ok: false
                    })
                }
                return resolve({
                    ok: true
                })
            })
        })
    })
}

module.exports = {
    crearUsuarioDB,
    obtenerMedicosDB,
    obtenerEstadoMedicoDB,
    cambiarEstadoMedicoDB,
    obtenerDatosMedicoModificar,
    modificarMedicoDB,
    obtenerRolesPacienteDB
}