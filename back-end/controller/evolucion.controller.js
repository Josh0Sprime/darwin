const { EvolucionesPaciente, DetalleEvolucionPaciente, ListadoDeServicios, AltasHoy, CantidadAltas, CantidadPacientes, obtenerTodosLosEpisodiosDelPaciente, obtenerTodosLosEpisodiosDelPacienteDB, confirmarEvolucionDB, obtenerDetalleDeEvolucionPDF, obtenerDatosServicio ,EvolucionesHoy, ListadoEvolucionesPorEpisodio, AltasVencidas, verificarAgregarEvolucion } = require("../models/evolucion.models")
const { response } = require("express");

const obtenerTodasLasEvolucionesDelPaciente = async(req, res = response) => {
    const { idPaciente } = req.body;
    try {
        const resp = await EvolucionesPaciente(idPaciente);
        if(!resp.ok){
            return res.json({
                ok:false
            })
        }
        return res.json(resp.resultado);
    } catch (error) {
        res.json({
            ok:false,
            msg: error
        })
    }
}

const obtenerListadoDeServicios = async(req, res = response) => {
    try {
        const response = await ListadoDeServicios()
        if(response){
            return res.json(response.resultado);
        }
        return res.json({
            ok:false
        })
    } catch (error) {
        return res.json({
            ok:false
        })
    }
}

const obtenerDetalleEvolucion = async(req, res = response) => {
    const { idEvolucion } = req.body;
    if(!idEvolucion || idEvolucion === '' || idEvolucion === undefined){
        return res.json({
            ok: false,
            msg: "Error en uno de los campos"
        });
    }
    try {
        const resp = await DetalleEvolucionPaciente(idEvolucion);
        if(!resp.ok){
            return res.json({
                ok:false
            });
        }
        return res.json(resp.resultado);
    } catch (error) {
        res.json({
            ok:false,
            msg: error
        });
    }
}

const obtenerAltasHoy = async (req, res = response) => {
    try {
        const resp = await AltasHoy();
        if(!resp.ok) {
            return res.json({
                ok: false,
                msg: resp
            });
        }

        return res.json({
            res: resp.res
        });
    } catch (error) {
        res.json({
            ok: false,
            msg: error,
        });
    }
}

const obtenerEpisodiosDelPaciente = async(req, res = response) => {
    const { idPaciente } = req.body;
    try {
        const response = await obtenerTodosLosEpisodiosDelPaciente(idPaciente);
        if(response){
            return res.json(response.resultado);
        }
        return res.json({
            ok:false
        })
    } catch (error) {
        return res.json({
            ok:false
        })
    }
}

const obtenerTodasLasEvolucionesDelEpisodio = async(req, res = response) => {
    const { Episodio } = req.body;
    try {
        const response = await ListadoEvolucionesPorEpisodio(Episodio);
        if(response){
            return res.json(response.resultado);
        }
        return res.json({
            ok:false
        })
    } catch (error) {
        return res.json({
            ok:false
        })
    }
}



const obtenerCantidadAltas = async (req, res = response) => {
    try {
        const resp = await CantidadAltas();
        if (!resp.ok) {
            return res.json({
                ok: false,
            });
        }

        return res.json({
            res: resp.res
        });
    } catch(error) {
        res.json({
            ok: false,
            msg: error,
        });
    }
}

const obtenerCantidadPacientes = async (req, res = response) => {
    try {
        const resp = await CantidadPacientes();
        if(!resp.ok) {
            return res.json({
                ok: false
            });
        }

        return res.json({
            ok: resp.res,
        });
    } catch(error) {
        res.json({
            ok: false,
            msg: error,
        });
    }
}

const obtenerEvolucionesHoy = async (req, res = response) => {
    try {
        const resp = await EvolucionesHoy();
        if(!resp.ok) {
            return res.json({
                ok: false,
            });
        }

        return res.json({
            ok: resp.res,
        });
    } catch(error) {
        res.json({
            ok: false,
            msg: error,
        });
    }
}

const confirmarEvolucion = async( req, res = response ) => {
    try {
        const { id_evolucion, diagnostico, evolucion, estudio_complementario, plan, nombre_interno, id_servicio, fecha_alta } = req.body;
        const resp = await confirmarEvolucionDB( id_evolucion, diagnostico, evolucion, estudio_complementario, plan, nombre_interno, id_servicio, fecha_alta );

        if(resp.ok){
            return res.json({
                ok: true,
                msg: "Evolucion confirmada"
            })
        }
        return res.json({
            ok: false,
            msg: "Error al confirmar evolucion"
        })
    } catch (error) {
        return res.json({
            ok: false,
            error
        })
    }
}

const obtenerDetalleDeEvolucionParaPDF = async(req, res = response) => {
    const { id_evolucion } = req.body;
    try {
        const response = await obtenerDetalleDeEvolucionPDF(id_evolucion);
        if(response){
            return res.json(response.resultado);
        }
        return res.json({
            ok:false
        })
    } catch (error) {
        return res.json({
            ok:false
        })
    }
}

const obtenerNombreServicio = async(req, res = response) => {
    const { idServicio } = req.body;
    try {
        const response = await obtenerDatosServicio(idServicio);
        if(response){
            return res.json(response.resultado);
        }
        return res.json({
            ok:false
        })
    } catch (error) {
        return res.json({
            ok:false
        })
    }
}

const obtenerAltasVencidas = async (req, res = response) => {
    try {
        const resp = await AltasVencidas();
        if(!resp.ok) {
            return res.json({
                ok: false,
            });
        }

        return res.json({
            ok: resp.res,
        });
    } catch(error) {
        res.json({
            ok: false,
            msg: error,
        });
    }
}

const validarEvolucion = async( req, res = response ) => {
    try {
        const { idPaciente } = req.body;
        const resp = await verificarAgregarEvolucion( idPaciente );
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
            ok: false,
            error
        })
    }
}


module.exports = {
    obtenerTodasLasEvolucionesDelPaciente, 
    obtenerDetalleEvolucion, 
    obtenerListadoDeServicios,
    obtenerAltasHoy,
    obtenerCantidadAltas,
    obtenerCantidadPacientes,
    obtenerEpisodiosDelPaciente,
    obtenerListadoDeServicios,
    obtenerEvolucionesHoy,
    obtenerTodasLasEvolucionesDelEpisodio,
    confirmarEvolucion,
    obtenerDetalleDeEvolucionParaPDF,
    obtenerNombreServicio,
    obtenerAltasVencidas,
    validarEvolucion
}
