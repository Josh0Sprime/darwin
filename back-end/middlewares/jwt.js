const jwt = require('jsonwebtoken');



const crearJWT = ( usuario, nombres, apellidos, id_usuario, rol ) => {
    return new Promise((resolve, reject) => {
        const payload = { usuario, nombres, apellidos, id_usuario, rol }
        jwt.sign(payload, process.env.JWT, {
            expiresIn: '1h'
        }, (err, token) => {
            if (err){
                return reject({
                    ok: false,
                    msg: "Error al crear el token"
                })
            }
            return resolve(token)
        })
    })
}


module.exports = crearJWT