const { Router } = require("express");
const { BuscarPersonaBrazalete, registrarPaciente, VerificarExistePaciente, obtenerPaciente, obtenerListadoPacientes, obenerInformacionPaciente, obtenerultimaFechaAltaYtotalEva, DarDeAltaAlPaciente, consultarEstadoEvolucionPaciente, listarPacientesAlta, obtenerIdPaciente, obtenerEvoluciones, obtenerIdDePaciente, obtenerRoles, obtenerPacienteFonasa } = require("../controller/paciente.controller");
const { validarTokenSolicitud, validarTokenSolicitudHeader, validarCamposAgregarPaciente, validarCampoIdPaciente , validarCampoRunPaciente } = require('../middlewares/validarCampos');
const route = Router();

route.post('/buscarPersonaBrazalete', [validarTokenSolicitud, validarCampoRunPaciente], BuscarPersonaBrazalete);
route.post('/verificarPaciente', [validarTokenSolicitud, validarCampoRunPaciente], VerificarExistePaciente);
route.post('/registrarPaciente', [validarTokenSolicitud, validarCamposAgregarPaciente], registrarPaciente);
route.get('/listadoPacientes', validarTokenSolicitudHeader, obtenerListadoPacientes);
route.get('/listadoPacientesAlta', validarTokenSolicitudHeader, listarPacientesAlta);
route.post('/obtenerIdPaciente', validarTokenSolicitud, obtenerIdPaciente);
route.post('/obtenerIdPacienteEvolucion', validarTokenSolicitud, obtenerIdDePaciente);
route.post('/verificarEvoluciones', validarTokenSolicitud, obtenerEvoluciones);
route.post('/buscarPacienteFonasa', [validarTokenSolicitud, validarCampoRunPaciente], obtenerPaciente);
route.post('/informacionPaciente', [validarTokenSolicitud, validarCampoIdPaciente], obenerInformacionPaciente);
route.post('/informacionAdicionalPaciente', [validarTokenSolicitud, validarCampoIdPaciente], obtenerultimaFechaAltaYtotalEva);
route.post('/altaPaciente',[validarTokenSolicitud, validarCampoIdPaciente], DarDeAltaAlPaciente);
route.post('/verificarEstadoEpisodio', [validarTokenSolicitud, validarCampoIdPaciente], consultarEstadoEvolucionPaciente);
route.post('/buscarFonasa', obtenerPacienteFonasa);

module.exports = route;