const { Router } = require("express");
const { crearUsuario, obtenerMedicos, obtenerEstadoMedico, cambiarEstadoMedico, obtenerDatosMedico, modificarMedico, obtenerRoles } = require("../controller/medicos.controller");
const { validarCamposCrearUsuario, validarCamposRunMedico, validarCamposEstadoMedico, validarCamposObtenerDatosMedicos, validarCamposModificar, validarTokenSolicitud, validarTokenSolicitudHeader } = require("../middlewares/validarCampos");





const router = Router();

router.post('/crearMedico', [validarCamposCrearUsuario, validarTokenSolicitud], crearUsuario);
router.get('/obtener', validarTokenSolicitudHeader, obtenerMedicos);
router.post('/obtenerEstado', [validarCamposRunMedico, validarTokenSolicitud], obtenerEstadoMedico);
router.post('/cambiarEstado', [validarCamposEstadoMedico, validarTokenSolicitud], cambiarEstadoMedico);
router.post('/obtenerDatosMedico', [validarCamposObtenerDatosMedicos, validarTokenSolicitud], obtenerDatosMedico);
router.patch('/modificarMedico', [validarCamposModificar, validarTokenSolicitud], modificarMedico);
router.get('/obtenerRoles', validarTokenSolicitudHeader, obtenerRoles);

module.exports = router;