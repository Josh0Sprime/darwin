const { Router } = require("express");
const { obtenerTodasLasEvolucionesDelPaciente, obtenerDetalleEvolucion, obtenerListadoDeServicios, obtenerAltasHoy, obtenerCantidadAltas, obtenerCantidadPacientes, obtenerEpisodiosDelPaciente, obtenerTodasLasEvolucionesDelEpisodio, confirmarEvolucion, obtenerEvolucionesHoy, obtenerAltasVencidas, obtenerDetalleDeEvolucionParaPDF, obtenerNombreServicio, validarEvolucion } = require("../controller/evolucion.controller");
const { obtenerEvolucionPaciente, agregarEvolucion, agregarEvolucionEnProceso, obtenerEvolucionPacienteConfirmar } = require("../controller/paciente.controller");
const { validarCampoIdPaciente, validarTokenSolicitud, validarTokenSolicitudHeader, validarCamposAgregarEvolucion, validarCampoEpisodio, validarIdEvolucion, validarCampoIdServicio, validarIdEvolucionActual } = require("../middlewares/validarCampos");
// const { obtenerTodasLasEvolucionesDelPaciente, obtenerDetalleEvolucion, obtenerListadoDeServicios, obtenerAltasHoy, obtenerCantidadAltas, obtenerCantidadPacientes, obtenerEpisodiosDelPaciente, obtenerEvolucionesHoy } = require("../controller/evolucion.controller");
// const { obtenerTodasLasEvolucionesDelPaciente, obtenerDetalleEvolucion, obtenerListadoDeServicios, obtenerAltasHoy, obtenerCantidadAltas, obtenerCantidadPacientes, obtenerEpisodiosDelPaciente, confirmarEvolucion, obtenerEvolucionesHoy } = require("../controller/evolucion.controller");


const route = Router();

route.post('/EvolucionPaciente', [validarTokenSolicitud, validarCampoIdPaciente], obtenerTodasLasEvolucionesDelPaciente);
route.post('/DetalleEvolucion' , validarTokenSolicitud, obtenerDetalleEvolucion);
route.get('/ListadoServicios'  , validarTokenSolicitudHeader, obtenerListadoDeServicios);
route.post('/obtenerEvolucion' , validarCampoIdPaciente, obtenerEvolucionPaciente);
route.post('/obtenerEvolucionConfirmar', validarTokenSolicitud, obtenerEvolucionPacienteConfirmar);
route.post('/agregarEvolucion' , validarCamposAgregarEvolucion, agregarEvolucion);
route.post('/agregarEvolucionProceso' , validarCamposAgregarEvolucion, agregarEvolucionEnProceso);
route.post('/altasHoy'         , validarTokenSolicitud, obtenerAltasHoy);
route.post('/altas'            , validarTokenSolicitud, obtenerCantidadAltas);
route.post('/pacientes'        , validarTokenSolicitud, obtenerCantidadPacientes);
route.post('/EpisodiosPaciente', [validarTokenSolicitud,validarCampoIdPaciente], obtenerEpisodiosDelPaciente);
route.post('/evolucionesHoy'   , validarTokenSolicitud, obtenerEvolucionesHoy);
route.post('/confirmarEvolucion', [validarTokenSolicitud, validarIdEvolucion], confirmarEvolucion);
route.post('/EvolucionPDF', [validarTokenSolicitud, validarIdEvolucion], obtenerDetalleDeEvolucionParaPDF);
route.post('/EvolucionPDFActual', [validarTokenSolicitud, validarIdEvolucionActual], obtenerDetalleDeEvolucionParaPDF)
route.post('/NombreServicio', [validarTokenSolicitud, validarCampoIdServicio], obtenerNombreServicio);
route.post('/EvolucionesEpisodio', [ validarCampoEpisodio], obtenerTodasLasEvolucionesDelEpisodio);
route.post('/obtenerAltasVencidas', validarTokenSolicitud, obtenerAltasVencidas);
route.post('/verificarEvolucion', [validarTokenSolicitud, validarCampoIdPaciente], validarEvolucion);

module.exports = route