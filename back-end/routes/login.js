const { Router } = require("express");
const { validarUsuario, renovarTk } = require("../controller/login.controller");
const {validarToken} = require("../helper/validarJwt");
const { validarCamposLogin } = require("../middlewares/validarCampos");



const route = Router();

route.post('/validar', validarCamposLogin, validarUsuario);
route.get('/validarToken', validarToken, renovarTk)


module.exports = route;