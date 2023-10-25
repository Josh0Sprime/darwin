const express = require('express');
const cors = require('cors');
const env = require('dotenv');
const path = require('path');

const { response } = require('express');
env.config();

class Server {

    constructor() {
        this.app = express();
        this.middlewares();
        this.rutas = {
            login: '/login',
            paciente: "/paciente",
            medico: "/medico",
            evolucion: "/evolucion"
        }
        this.routes();
        this.app.use(express.static('public'));
        this.app.get('*', (req, res = response) => {
            res.sendFile(path.resolve(__dirname, '../public/index.html'));
        });
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
    }

    listen() {
        this.app.listen(process.env.PORT, () => { console.log("Servidor corriendo!") })
    }

    routes() {
        this.app.use(this.rutas.login, require('../routes/login.js'));
        this.app.use(this.rutas.paciente, require('../routes/paciente.js'));
        this.app.use(this.rutas.medico, require('../routes/medicos.js'));
        this.app.use(this.rutas.evolucion, require('../routes/evolucion.js'));
    }
}

module.exports = Server;