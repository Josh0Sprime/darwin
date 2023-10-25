const {conexionDB,conexionDBbrazalete } = require("../db/conexion.js");


const buscarPacienteBrazaleteDB = ( run ) => {
    return new Promise((resolve, reject) => {
        const sql = `select * from persona where run = '${run}';`;
        conexionDBbrazalete.query(sql, (err, resultado) => {
            if(err){
                return reject({
                    ok: false,
                    err
                })
            }
            return resolve({
                resultado
            })
        })
    })
}

const verificarPaciente = ( run ) => {
    return new Promise((resolve, reject) => {
        try {
            const sql = `select * from paciente where run = '${run}';`;
            conexionDB.query(sql, (err, resultado) => {
                if (resultado === undefined || Object.entries(resultado).length === 0) {
                    reject(false);
                }
                else{
                    resolve({
                        ok:true,
                        resultado
                    })
                    reject(false);
                }
            })
        } catch (error) {
            reject(error)
        }
    })
}

//ultima fecha alta + total de evoluciones
const obtenerInformacionAdicionalPaciente = (idPaciente) => {
    return new Promise((resolve, reject) => {
        try {
            const sql = `SELECT evolucion.fecha_registro, if(MAX(evolucion.fecha_alta) IS NULL, 'POR DEFINIR', MAX(evolucion.fecha_alta)) AS ultimaFechaAlta,
                                COUNT(evolucion.id) AS total_evoluciones,evolucion.n_episodio
                            FROM evolucion
                            LEFT JOIN episodio_evolucion ON episodio_evolucion.episodio = evolucion.n_episodio
                            WHERE evolucion.id_paciente = '${idPaciente}' AND episodio_evolucion.id_estado = '1'
                            ORDER BY fecha_registro DESC;`;
            conexionDB.query(sql, (err, resultado) => {
                if (resultado === undefined || Object.entries(resultado).length === 0) {
                    reject(false);
                }
                else{
                    resolve({
                        ok:true,
                        resultado
                    })
                    reject(false);
                }
            })
        } catch (error) {
            reject(error)
        }
    })
}

const informacionPaciente = (idPaciente) => {
    return new Promise((resolve, reject) => {
        try {
            const sql = `select * from paciente where paciente.id = '${idPaciente}';`;
            conexionDB.query(sql, (err, resultado) => {
                if (resultado === undefined || Object.entries(resultado).length === 0) {
                    reject(false);
                }
                else{
                    resolve({
                        ok:true,
                        resultado
                    })
                    reject(false);
                }
            })
        } catch (error) {
            reject(error)
        }
    })
}


const listadoTodosLosPacientes = () => {
    return new Promise((resolve, reject) => {
        try {
            const sql = `select paciente.id,
                                paciente.run,
                                paciente.pasaporte,
                                paciente.nombres,
                                paciente.apellidos,
                                paciente.fecha_nacimiento,
                                paciente.genero,
                                paciente.fecha_ingreso,
                                estado_paciente.estado as estado_paciente
                                from paciente
                                left join estado_paciente on estado_paciente.id = paciente.id_estado where paciente.id_estado = 1`;
            conexionDB.query(sql, (err, resultado) => {
                if (err) {
                    reject(false);
                }
                if(resultado.length <= 0){
                    resolve({
                        ok: true,
                        resultado
                    })
                }
                else{
                    resolve({
                        ok:true,
                        resultado
                    })
                    reject(false);
                }
            })
        } catch (error) {
            reject(error)
        }
    })
}

const listadoTodosLosPacientesAlta = () => {
    return new Promise((resolve, reject) => {
        try {
            const sql = `select paciente.id,
                                paciente.run,
                                paciente.pasaporte,
                                paciente.nombres,
                                paciente.apellidos,
                                paciente.fecha_nacimiento,
                                paciente.genero,
                                paciente.fecha_ingreso,
                                estado_paciente.estado as estado_paciente
                                from paciente
                                left join estado_paciente on estado_paciente.id = paciente.id_estado where paciente.id_estado = 2`;
            conexionDB.query(sql, (err, resultado) => {
                if (resultado === undefined || Object.entries(resultado).length === 0) {
                    reject(false);
                }
                else{
                    resolve({
                        ok:true,
                        resultado
                    })
                    reject(false);
                }
            })
        } catch (error) {
            reject(error)
        }
    })
}


const registrarNuevoPaciente = ( run, nombres, apellidos, fecha_nacimiento, genero, fecha_ingreso ) => {
    return new Promise((resolve, reject) => {
        const sql = `select * from paciente where run = '${run}'`;
        conexionDB.query(sql, (err, resultado) => {
            if(err){
                return reject({
                    ok: false,
                    err
                })
            }
            let id_paciente;

            if(resultado.length <= 0){

                const sql = `insert into paciente(run, nombres, apellidos, fecha_nacimiento, genero, fecha_ingreso, id_estado) values('${run}', '${nombres}', '${apellidos}',  '${fecha_nacimiento}',  '${genero}',  '${fecha_ingreso}', '1');`;
                conexionDB.query(sql, (err, resultado) => {
                    if(err){
                        return reject({
                            ok: false,
                            err
                        })
                    }
                    const sql = `select * from paciente where run = '${run}'`;
                    conexionDB.query(sql, (err, resultado) => {
                        if(err){
                            return reject({
                                ok: false,
                                err
                            })
                        }
                        id_paciente = resultado[0]["id"];


                        const sqlBuscarEstadoEpisodio = `SELECT * FROM	episodio_evolucion WHERE episodio_evolucion.id_paciente = '${id_paciente}' ORDER BY fecha_inicio DESC LIMIT 1;`
                        conexionDB.query(sqlBuscarEstadoEpisodio, (err, resultado) => {
                            if(err){
                                return reject({
                                    ok: false,
                                    err
                                })
                            }
                            else if(resultado <= 0){
                                const sql = `insert into episodio_evolucion (id_paciente, fecha_inicio, id_estado) values('${id_paciente}', '${fecha_ingreso}', '1')`;
                                conexionDB.query(sql, (err, resultado) => {
                                    if(err){
                                        return reject({
                                            ok: false,
                                            err
                                        })
                                    }
                                    return resolve({
                                        ok: true,
                                        msg: "Paciente agregado"
                                    })
                                })
                            }
                            else if(resultado.length > 0 && resultado[0]["id_estado"] == 1){
                            console.log(resultado)
                                return reject({
                                    ok: false,
                                    msg: "Este paciente posee un episodio activo"
                                })
                            }
                            else if(resultado.length > 0 && resultado[0]["id_estado"] == 2){
                                const sql = `insert into episodio_evolucion (id_paciente, fecha_inicio, id_estado) values('${id_paciente}', '${fecha_ingreso}', '1')`;
                                conexionDB.query(sql, (err, resultado) => {
                                    if(err){
                                        return reject({
                                            ok: false,
                                            err
                                        })
                                    }

                                })
                            }
                        })

                    })
                })
            }else{
                id_paciente = resultado[0]["id"];
                const id_estado = resultado[0]["id_estado"];

                const sqlBuscarEstadoEpisodio = `SELECT * FROM  episodio_evolucion WHERE episodio_evolucion.id_paciente = '${id_paciente}' ORDER BY episodio_evolucion.episodio DESC LIMIT 1;`;
                conexionDB.query(sqlBuscarEstadoEpisodio, (err, resultado) => {
                    if(err){
                        return reject({
                            ok: false,
                            err
                        })
                    }
                    if(resultado <= 0){
                        const sqlEpisodio = `insert into episodio_evolucion (id_paciente, fecha_inicio, id_estado) values('${id_paciente}', '${fecha_ingreso}', '1')`;
                        conexionDB.query(sqlEpisodio, (err, resultado) => {
                            if(err){
                                return reject({
                                    ok: false,
                                    err
                                })
                            }
                            const sql = `update paciente set id_estado = '1', nombres = '${nombres}', apellidos = '${apellidos}', genero = '${genero}', fecha_ingreso = '${fecha_ingreso}' where id = '${id_paciente}'`;
                            conexionDB.query(sql, (err, resultado) => {
                                        if(err){
                                            return reject({
                                                ok: false
                                            })
                                        }
                                        return resolve({
                                            ok: true,
                                            msg: "Paciente agregado"
                                        })
                                })
                        })
                    }
                   if(resultado.length > 0){
                    if(resultado[0]["id_estado"] == 1){
                        return reject({
                            ok: false,
                            msg: "Este paciente posee un episodio activo"
                    });
                    }else{
                        const sqlEpisodio = `insert into episodio_evolucion (id_paciente, fecha_inicio, id_estado) values('${id_paciente}', '${fecha_ingreso}', '1')`;
                        conexionDB.query(sqlEpisodio, (err, resultado) => {
                            if(err){
                                return reject({
                                    ok: false,
                                    err
                                })
                            }
                            if(id_estado == 2){
                                const sql = `update paciente set id_estado = '1', nombres = '${nombres}', apellidos = '${apellidos}', genero = '${genero}', fecha_ingreso = '${fecha_ingreso}' where id = '${id_paciente}'`;
                                conexionDB.query(sql, (err, resultado) => {
                                        if(err){
                                            return reject({
                                                ok: false
                                            })
                                        }
                                        return resolve({
                                            ok: true,
                                            msg: "Paciente agregado"
                                        })
                                })
                            }
                            return resolve({
                                ok: true,
                                msg: "Paciente agregado"
                            })
                        })
                    }
                   }
                })
            }
        })
    })

}

const obtenerPacienteIdPaciente = ( id_evolucion ) => {
    return new Promise((resolve, reject) => {
        const sql = `select * from evolucion where id = '${id_evolucion}'`;
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


const verificarEstadoEvolucionPaciente = ( id_paciente ) => {
    return new Promise((resolve, reject) => {
        const sqlBuscarEstadoEpisodio = `SELECT * FROM	episodio_evolucion WHERE episodio_evolucion.id_paciente = '${id_paciente}' ORDER BY fecha_inicio DESC LIMIT 1;`
        conexionDB.query(sqlBuscarEstadoEpisodio, (err, resultado) =>{
            if(err){
                return reject({
                    ok: false,
                    err
                })
            }
            return resolve({
                ok: true,
                resultado
            })
        })
    })
}

const DarDeAlta = ( idPaciente ) => {

    return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM	episodio_evolucion WHERE episodio_evolucion.id_paciente = '${idPaciente}' ORDER BY fecha_inicio DESC LIMIT 1;`
            conexionDB.query(sql, (err, resultado) => {
                if( err ){
                    return reject({
                        ok: false,
                        msg: "Error al modificar estado devolucion"
                    })
                }
                const n_episodio = resultado[0]["episodio"];

                if(resultado[0]["id_estado"] == 1){
                    const sql = `SELECT evolucion .id AS id_evolucion,
                    evolucion.fecha_registro,
                    medico.nombres AS nombres_medico,
                    medico.apellidos AS apellidos_medico,
                    servicio.nombre AS nombre_servicio,
                    evolucion.fecha_alta,
                    evolucion.id_estado
                    FROM evolucion
                    LEFT JOIN medico ON medico.id = evolucion.id_medico
                    LEFT JOIN servicio ON servicio.id = evolucion.id_servicio
                    WHERE evolucion.n_episodio = '${n_episodio}' AND evolucion.id_estado = 1;`;
                    conexionDB.query(sql, (err, resultado) => {
                        if(err){
                            return reject({
                                ok: false,
                                err
                            })
                        }
                        if(resultado.length > 0){
                            return reject({
                                ok: false,
                                apto: false
                            })
                        }

                        const date = new Date();
                        const fecha_termino = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                        const sql = `update episodio_evolucion set id_estado = '2', fecha_termino = '${fecha_termino}' where id_paciente = '${idPaciente}' and episodio = '${n_episodio}';`;
                         conexionDB.query(sql, (err, resultado) => {
                            if(err){
                                return reject({
                                    ok: false
                                })
                            }
                            const sql = `update paciente set id_estado = '2' where paciente.id = '${idPaciente}';`;
                            conexionDB.query(sql, (err, resultado) => {
                                if(err){
                                    return reject({
                                        ok: false
                                    })
                                }
                                return resolve({
                                    ok: true,
                                    msg: "Paciente dado de alta"
                                })
                            })
                        })
                    })
                }
            })
        })
};


const verificarEvolucionesPaciente = ( id_paciente ) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM	episodio_evolucion WHERE episodio_evolucion.id_paciente = '${id_paciente}' ORDER BY fecha_inicio DESC LIMIT 1;`
        conexionDB.query(sql, (err, resultado) =>{
            if(err){
                return reject({
                    ok: false
                })
            }
            if(resultado.length <= 0){
                return reject({
                    ok: false,
                    apto: false
                })
            }
            const fecha_inicio = resultado[0]["fecha_inicio"].toString();
            const date = new Date(fecha_inicio);
            const fecha_data = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
            const sql = `SELECT estado_evolucion.nombre as nombre_estado, evolucion.id, evolucion.fecha_registro, medico.nombres AS nombre_medico, servicio.nombre AS nombre_servicio, evolucion.fecha_alta, evolucion.diagnostico, evolucion.evolucion, evolucion.plan FROM evolucion LEFT JOIN medico ON evolucion.id_medico = medico.id LEFT JOIN servicio ON evolucion.id_servicio = servicio.id LEFT JOIN episodio_evolucion ON evolucion.n_episodio = episodio_evolucion.episodio LEFT JOIN estado_evolucion ON evolucion.id_estado = estado_evolucion.id where evolucion.id_paciente = '${id_paciente}' AND episodio_evolucion.fecha_inicio = '${fecha_data}';`
            conexionDB.query(sql, (err, resultado) => {
                if(err){
                    return reject({
                        ok: false
                    })
                }
                else if(resultado.length <= 0){
                    return reject({
                        ok: false,
                        evoluciones: false
                    })
                }
                return resolve({
                    ok: true,
                    evoluciones: true
                })
            })
        })
    })
}


const obtenerEvolucionPacienteDB = ( id_paciente ) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * , evolucion.id_estado AS estadoEvolucion  from evolucion LEFT JOIN episodio_evolucion ON evolucion.n_episodio = episodio_evolucion.episodio WHERE evolucion.id_paciente = '${id_paciente}' AND episodio_evolucion.id_estado = 1 ORDER BY evolucion.fecha_registro DESC LIMIT 1;`;
        conexionDB.query(sql, (err, resultado) => {
            if(err){
                return reject({
                    ok: false,
                    msg: "Paciente sin evoluciones"
                })
            }
            if(resultado.length <= 0){
                return reject({
                    ok: false,
                    msg: "Paciente sin evoluciones"
                })
            }
            return resolve({
                ok: true,
                resultado
            })
        })
    })
};

const obtenerEvolucionPacienteConfirmarDB = ( id_evolucion ) => {
    return new Promise((resolve, reject) => {
        const sql = `select * from evolucion left join servicio on evolucion.id_servicio = servicio.id where evolucion.id = '${id_evolucion}';`;
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
};


const obtenerEstadoPaciente = ( run ) => {
    return new Promise((resolve, reject) => {
        const sql = `select id_estado from paciente where paciente.run = ${run}`;
        conexionDB.query(sql, (err, resultado) => {
            if(err){
                return reject({
                    ok: false,
                    msg: "Paciente no encontrado"
                })
            }
            if(resultado.length <= 0){
                return reject({
                    ok: false,
                    msg: "Paciente no encontrado"
                })
            }
            return resolve({
                ok: true,
                resultado
            })
        })
    })
};

const agregarEvolucionPacienteDB = ( fecha_registro, id_paciente, id_medico, id_servicio, diagnostico, evolucion, plan, fecha_alta, estudios_complementarios, participacion_interno,
    nombre_interno ) => {
    if(participacion_interno){
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM	episodio_evolucion WHERE episodio_evolucion.id_paciente = '${id_paciente}' AND episodio_evolucion.id_estado = 1 ORDER BY fecha_inicio DESC LIMIT 1;`;
            conexionDB.query(sql, (err, resultado) => {
                if(err){
                    return reject({
                        ok: false,
                        err
                    })
                }
                if(resultado.length <= 0){
                    return reject({
                        ok: false
                    })
                }
                const episodio = resultado[0]["episodio"];

                const sql = `INSERT INTO evolucion (fecha_registro, id_paciente, id_medico, id_servicio, diagnostico, evolucion, plan, estudios_complementarios, fecha_alta, id_estado, n_episodio,
                    interno_medicina) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, '2', ?, ?);`;
                conexionDB.query(sql,
                    [
                        fecha_registro,
                        id_paciente,
                        id_medico,
                        id_servicio,
                        diagnostico,
                        evolucion,
                        plan,
                        estudios_complementarios,
                        fecha_alta,
                        episodio,
                        nombre_interno
                    ],(err, resultado) => {
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
    }else{

        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM	episodio_evolucion WHERE episodio_evolucion.id_paciente = '${id_paciente}' AND episodio_evolucion.id_estado = 1 ORDER BY fecha_inicio DESC LIMIT 1;`;
            conexionDB.query(sql, (err, resultado) => {
                if(err){
                    return reject({
                        ok: false,
                        err
                    })
                }
                if(resultado.length <= 0){
                    return reject({
                        ok: false
                    })
                }
                const episodio = resultado[0]["episodio"];
                const sql = `CALL nueva_evolucion(?, ?, ?, ?,?, ?, ?, ?, ?, '2' , ?)`;
                conexionDB.query(sql,
                    [
                        fecha_registro,
                        id_paciente,
                        id_medico,
                        id_servicio,
                        diagnostico,
                        evolucion,
                        plan,
                        estudios_complementarios,
                        fecha_alta,
                        episodio
                    ],(err, resultado) => {
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
};

const agregarEvolucionEnProcesoDB = ( fecha_registro, id_paciente, id_medico, id_servicio, diagnostico, evolucion, plan, fecha_alta, estudios_complementarios, participacion_interno,
    nombre_interno ) => {
        if(participacion_interno){
            return new Promise((resolve, reject) => {
                const sql = `SELECT * FROM	episodio_evolucion WHERE episodio_evolucion.id_paciente = '${id_paciente}' AND episodio_evolucion.id_estado = 1 ORDER BY fecha_inicio DESC LIMIT 1;`;
                conexionDB.query(sql, (err, resultado) => {
                    if(err) {
                        return reject({
                            ok: false,
                            err
                        })
                    }
                    if(resultado.length <= 0){
                        return reject({
                            ok: false
                        })
                    }
                    const episodio = resultado[0]["episodio"];
                    const sql = `INSERT INTO evolucion (fecha_registro, id_paciente, id_medico, id_servicio, diagnostico, evolucion, plan, estudios_complementarios, fecha_alta, id_estado, n_episodio,
                        interno_medicina) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, '1', ?, ?);`;
                    conexionDB.query(sql,
                        [
                            fecha_registro,
                            id_paciente,
                            id_medico,
                            id_servicio,
                            diagnostico,
                            evolucion,
                            plan,
                            estudios_complementarios,
                            fecha_alta,
                            episodio,
                            nombre_interno
                        ],(err, resultado) => {
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
        }else{

            return new Promise((resolve, reject) => {
                const sql = `SELECT * FROM	episodio_evolucion WHERE episodio_evolucion.id_paciente = '${id_paciente}' AND episodio_evolucion.id_estado = 1 ORDER BY fecha_inicio DESC LIMIT 1;`;
                conexionDB.query(sql, (err, resultado) => {
                    if(err){
                        return reject({
                            ok: false,
                            err
                        })
                    }
                    if(resultado.length <= 0){
                        return reject({
                            ok: false
                        })
                    }
                    const episodio = resultado[0]["episodio"];
                    const sql = `INSERT INTO evolucion (fecha_registro, id_paciente, id_medico, id_servicio, diagnostico, evolucion, plan, estudios_complementarios, fecha_alta, id_estado, n_episodio,
                        interno_medicina) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, '1', ?, 'no');`;
                    conexionDB.query(sql,
                        [
                            fecha_registro,
                            id_paciente,
                            id_medico,
                            id_servicio,
                            diagnostico,
                            evolucion,
                            plan,
                            estudios_complementarios,
                            fecha_alta,
                            episodio,
                        ],(err, resultado) => {
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
};

// esta funcion aplica cuando el paciente ha sido dado de alta, sin embargo si en un futuro vuelve
// solo se debe cambiar el estado y la fecha de ingreso.
const HospitalzarPacienteNuevamente = ( run, fecha_ingreso ) => {

    return new Promise((resolve, reject) => {
        const sql = `update paciente set id_estado = '1', fecha_ingreso = '${fecha_ingreso}'  where paciente.run = '${run}'`;
        conexionDB.query(sql, (err, resultado) => {
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

};


const obtenerPacienteDB = ( run ) => {
    return new Promise((resolve, reject) => {
        const sql = `select * from paciente where run = '${run}'`;
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
};



module.exports = {
    buscarPacienteBrazaleteDB,
    verificarPaciente,
    listadoTodosLosPacientes,
    registrarNuevoPaciente,
    informacionPaciente,
    obtenerInformacionAdicionalPaciente,
    agregarEvolucionPacienteDB,
    obtenerEvolucionPacienteDB,
    DarDeAlta,
    obtenerEstadoPaciente,
    HospitalzarPacienteNuevamente,
    verificarEstadoEvolucionPaciente,
    listadoTodosLosPacientesAlta,
    obtenerPacienteDB,
    verificarEvolucionesPaciente,
    agregarEvolucionEnProcesoDB,
    obtenerEvolucionPacienteConfirmarDB,
    obtenerPacienteIdPaciente
};
