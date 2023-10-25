const mysql = require('mysql2');

const conexionDB = mysql.createPool({
    host: 'mysqlproduccion.hospitalovalle.cl',
    user: 'darwin',
    password: 'XCUUIN5sBVFaR1gu',
    database: "evolucion_paciente"
});

const conexionDBbrazalete = mysql.createPool({
    host: 'mysqlproduccion.hospitalovalle.cl',
    user: 'brazaletes',
    password: 'UNiLqRo7AT3btVAi',
    database: "brazaletes"
});


module.exports = {conexionDB, conexionDBbrazalete}