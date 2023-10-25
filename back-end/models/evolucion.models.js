const { conexionDB } = require("../db/conexion.js");


const EvolucionesPaciente = (idPaciente) => {

    return new Promise((resolve, reject) => {
        try {
            const sql = `SELECT * FROM	episodio_evolucion WHERE episodio_evolucion.id_paciente = '${idPaciente}' AND episodio_evolucion.id_estado = 1 ORDER BY fecha_inicio DESC LIMIT 1;`
            conexionDB.query(sql, (err, resultado) => {
                if (resultado === undefined || err) {
                    return reject({
                        ok: false,
                        err
                    });
                }
                if (resultado.length <= 0) {
                    return reject({
                        ok: false
                    })
                }
                const fecha_inicio = resultado[0]["fecha_inicio"].toString();
                const date = new Date(fecha_inicio);
                const fecha_data = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
                const sql = `SELECT medico.id as id_medico, estado_evolucion.nombre as nombre_estado, evolucion.id, evolucion.fecha_registro, medico.nombres AS nombre_medico, servicio.nombre AS nombre_servicio, evolucion.fecha_alta, evolucion.diagnostico, evolucion.evolucion, evolucion.plan FROM evolucion LEFT JOIN medico ON evolucion.id_medico = medico.id LEFT JOIN servicio ON evolucion.id_servicio = servicio.id LEFT JOIN episodio_evolucion ON evolucion.n_episodio = episodio_evolucion.episodio LEFT JOIN estado_evolucion ON evolucion.id_estado = estado_evolucion.id where evolucion.id_paciente = '${idPaciente}' AND episodio_evolucion.fecha_inicio = '${fecha_data}' order by evolucion.fecha_registro desc;`
                conexionDB.query(sql, (err, resultado) => {
                    if (err) {
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
        } catch (error) {
            reject(error)
        }
    })
}

const DetalleEvolucionPaciente = (idEvolucion) => {

    return new Promise((resolve, reject) => {
        try {
            const sql = `select evolucion .id, 
                                evolucion.fecha_registro,
                                medico.id AS id_medico,
                                evolucion.estudios_complementarios,
                                medico.nombres as nombres_medico, 
                                medico.apellidos as apellidos_medico, 
                                servicio.id as id_servicio,
                                servicio.nombre as nombre_servicio,
                                evolucion.diagnostico,
                                evolucion.evolucion,
                                evolucion.plan,
                                evolucion.fecha_alta
                                from evolucion 
                                left join medico on medico.id = evolucion.id_medico
                                left join servicio on servicio.id = evolucion.id_servicio
                                where evolucion.id = '${idEvolucion}';`;
            conexionDB.query(sql, (err, resultado) => {
                if (resultado === undefined || Object.entries(resultado).length === 0) {
                    reject(false);
                }
                else {
                    resolve({
                        ok: true,
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


const ListadoEvolucionesPorEpisodio = (Episodio) => {

    return new Promise((resolve, reject) => {
        try {
            const sql = `SELECT evolucion .id as id_evolucion, 
                                evolucion.fecha_registro,
                                medico.nombres as nombres_medico, 
                                medico.apellidos as apellidos_medico, 
                                servicio.nombre as nombre_servicio,
                                evolucion.fecha_alta
                                from evolucion 
                                left join medico on medico.id = evolucion.id_medico
                                left join servicio on servicio.id = evolucion.id_servicio
                                WHERE evolucion.n_episodio = '${Episodio}';`;
            conexionDB.query(sql, (err, resultado) => {
                if (resultado === undefined || Object.entries(resultado).length === 0) {
                    reject(false);
                }
                else {
                    resolve({
                        ok: true,
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

const ListadoDeServicios = () => {

    return new Promise((resolve, reject) => {

        const sql = "select * from servicio;";
        conexionDB.query(sql, (err, resultado) => {
            if (err) {
                return reject({
                    ok: false
                })
            };

            return resolve({
                ok: true,
                resultado
            })
        })
    })
}

const obtenerTodosLosEpisodiosDelPaciente = (idPaciente) => {

    return new Promise((resolve, reject) => {

        const sql = `SELECT episodio_evolucion.episodio, 
                            episodio_evolucion.id_paciente, 
                            episodio_evolucion.fecha_inicio, 
                            episodio_evolucion.fecha_termino, 
                            estado_episodio.estado
                            FROM episodio_evolucion
                            LEFT JOIN estado_episodio ON episodio_evolucion.id_estado = estado_episodio.id
                            WHERE episodio_evolucion.id_estado = '2' AND episodio_evolucion.id_paciente = '${idPaciente}' ORDER BY episodio_evolucion.episodio DESC;`;
        conexionDB.query(sql, (err, resultado) => {
            if (err) {
                return reject({
                    ok: false
                })
            };

            return resolve({
                ok: true,
                resultado
            })
        })
    })
}

const AltasHoy = () => {
    const hoy = new Date();
    let fecha = hoy.toISOString().split('T')[0];

    return new Promise((resolve, reject) => {
        const sql = `SELECT 
        paciente.nombres,
        paciente.id, 
        paciente.apellidos, 
        paciente.id_estado,
        evolucion.fecha_alta,
        servicio.nombre AS servicio
        FROM paciente
        JOIN evolucion
        ON paciente.id = evolucion.id_paciente
        JOIN servicio
        ON evolucion.id_servicio = servicio.id
        WHERE evolucion.fecha_alta LIKE '%${fecha}%'
        LIMIT 10`;

        conexionDB.query(sql, (err, res) => {
            if (err) {
                return reject({
                    ok: false,
                });
            }

            return resolve({
                ok: true,
                res
            });
        });
    });
}

const CantidadAltas = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT COUNT(*) AS contador FROM episodio_evolucion WHERE episodio_evolucion.id_estado = 2;`;
        conexionDB.query(sql, (err, res) => {
            if (err) {
                return reject({
                    ok: false,
                });
            }

            return resolve({
                ok: true,
                res
            });
        });
    });
}

const CantidadPacientes = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT COUNT(*) AS contador FROM paciente where paciente.id_estado = '1';`;
        conexionDB.query(sql, (err, res) => {
            if (err) {
                return reject({
                    ok: false,
                });
            }

            return resolve({
                ok: true,
                res
            });
        });
    });
}

const EvolucionesHoy = () => {
    const hoy = new Date();
    let fecha = hoy.toISOString().split('T')[0];
    return new Promise((resolve, reject) => {
        const sql = `SELECT COUNT(*) AS contador FROM evolucion WHERE evolucion.fecha_registro LIKE '${fecha}%';`;
        conexionDB.query(sql, (err, res) => {
            if (err) {
                return reject({
                    ok: false,
                });
            }

            return resolve({
                ok: true,
                res
            });
        });
    });
}

const confirmarEvolucionDB = (id_evolucion, diagnostico, evolucion, estudio, plan, nombre_interno, id_servicio, fecha_alta) => {
    return new Promise((resolve, reject) => {
        const sql = `update evolucion set id_estado = '2', diagnostico = ?, evolucion = ?, plan = ?, 
        estudios_complementarios = ?, id_servicio = ?, fecha_alta = ?, interno_medicina = ? where id = ?`;
        conexionDB.query(sql, [ diagnostico, evolucion, plan, estudio, id_servicio, fecha_alta, nombre_interno, id_evolucion ], (err, resultado) => {
            if (err) {
                return reject({
                    ok: false
                })
            }
            return resolve({
                ok: true,
                msg: "Evolucion confirmada"
            })
        })
    });
}

const obtenerDetalleDeEvolucionPDF = (id_evolucion) => {

    return new Promise((resolve, reject) => {

        const sql = `SELECT paciente.run AS run_paciente, 
                            paciente.pasaporte AS pasaporte_paciente, 
                            paciente.nombres AS nombres_paciente, 
                            paciente.apellidos AS apellidos_paciente, 
                            paciente.fecha_nacimiento,
                            paciente.genero,
                            paciente.fecha_ingreso,
                            medico.run AS run_medico,
                            medico.nombres AS nombres_medico,
                            medico.apellidos AS apellidos_medico,
                            servicio.nombre AS nombre_servicio,
                            evolucion.fecha_registro,
                            evolucion.diagnostico,
                            evolucion.evolucion,
                            evolucion.estudios_complementarios,
                            evolucion.plan,
                            evolucion.fecha_alta,
                            evolucion.n_episodio,
                            interno_medicina
                            FROM evolucion
                            LEFT JOIN paciente ON evolucion.id_paciente = paciente.id
                            LEFT JOIN medico ON evolucion.id_medico = medico.id
                            LEFT JOIN servicio ON evolucion.id_servicio = servicio.id
                            WHERE evolucion.id = '${id_evolucion}';`;
        conexionDB.query(sql, (err, resultado) => {
            if (err) {
                return reject({
                    ok: false
                })
            };

            return resolve({
                ok: true,
                resultado
            })
        })
    })
}


const obtenerDatosServicio = (idServicio) => {

    return new Promise((resolve, reject) => {

        const sql = `SELECT servicio.id, servicio.nombre from servicio where servicio.id = '${idServicio}';`;
        conexionDB.query(sql, (err, resultado) => {
            if (err) {
                return reject({
                    ok: false
                })
            };

            return resolve({
                ok: true,
                resultado
            })
        })
    })
}





const AltasVencidas = () => {
    return new Promise((resolve, reject) => {
        const sql = `
        SELECT 
        paciente.nombres,
        paciente.id, 
        paciente.apellidos, 
        paciente.id_estado,
        evolucion.fecha_alta,
        servicio.nombre AS servicio,
        episodio_evolucion.id_estado
        FROM paciente 
        JOIN evolucion
        ON paciente.id = evolucion.id_paciente
        JOIN servicio
        ON evolucion.id_servicio = servicio.id
        JOIN episodio_evolucion
        ON evolucion.n_episodio = episodio_evolucion.episodio
        WHERE episodio_evolucion.id_estado = 1 AND evolucion.fecha_alta < NOW();`;

        conexionDB.query(sql, (err, res) => {
            if (err) {
                return reject({
                    ok: false,
                });
            }

            return resolve({
                ok: true,
                res
            });
        });
    });
}



const verificarAgregarEvolucion = (id_paciente) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM evolucion WHERE id_paciente = '${id_paciente}' AND id_estado = 1;`
        conexionDB.query(sql, (err, resultado) => {
            if (err) {
                return reject({
                    ok: false
                })
            }
            else if (resultado.length > 0) {
                return reject({
                    ok: false,
                    msg: 'Con evolucion pendiente'
                })
            } else {
                return resolve({
                    ok: true,
                    msg: "Apto para nueva evolucion"
                })
            }
        })
    })
}


module.exports = {
    EvolucionesPaciente,
    DetalleEvolucionPaciente,
    ListadoDeServicios,
    AltasHoy,
    CantidadAltas,
    CantidadPacientes,
    obtenerTodosLosEpisodiosDelPaciente,
    ListadoEvolucionesPorEpisodio,
    confirmarEvolucionDB,
    EvolucionesHoy,
    obtenerDetalleDeEvolucionPDF,
    obtenerDatosServicio,
    EvolucionesHoy,
    confirmarEvolucionDB,
    AltasVencidas,
    ListadoEvolucionesPorEpisodio,
    verificarAgregarEvolucion
}