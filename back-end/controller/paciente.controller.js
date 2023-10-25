const { buscarPacienteBrazaleteDB, 
        registrarNuevoPaciente, 
        verificarPaciente, 
        listadoTodosLosPacientes, 
        informacionPaciente,
        obtenerInformacionAdicionalPaciente, 
        obtenerEvolucionPacienteDB,
        agregarEvolucionPacienteDB,
        DarDeAlta,
        verificarEstadoEvolucionPaciente,
        listadoTodosLosPacientesAlta,
        obtenerPacienteDB,
        verificarEvolucionesPaciente,
        agregarEvolucionEnProcesoDB,
        obtenerEvolucionPacienteConfirmarDB,
        obtenerPacienteIdPaciente,
        obtenerRolesPacienteDB} = require("../models/paciente.model")


const { response, request } = require('express');
const soapRequest = require('easy-soap-request');
const fs = require("fs");
const xmlBuilder = require("xmlbuilder");
const convert = require('xml-js');
const { resolve } = require("path");

const url = "http://ws.fonasa.cl:8080/Certificados/Previsional";
const headers = {
    "user-agent": "sampleTest",
    "Content-Type": "text/xml;charset=UTF-8",
    "soapAction": "getCertificadoPrevisional"
};

// const xml = fs.readFileSync("assets/fonasa.xml");

const obtenerPaciente = async(req, res = response) => {
    try {
        let { run, dverificador } = req.body;

        run = run.split("-");

        let xml = xmlBuilder
            .create("soapenv:Envelope")
            .att("xmlns:soapenv", "http://schemas.xmlsoap.org/soap/envelope/")
            .att("xmlns:cer", "http://certificadorprevisional.fonasa.gov.cl.ws/")
            .ele("soapenv:Header").up()
            .ele("soapenv:Body")
            .ele("cer:getCertificadoPrevisional")
            .ele("cer:query")
            .ele("cer:queryTO")
            .ele("cer:tipoEmisor", "10").up()
            .ele("cer:tipoUsuario", "1").up().up()
            .ele("cer:entidad", "61606407").up()
            .ele("cer:claveEntidad", "6160").up()
            .ele("cer:rutBeneficiario", `${run[0]}`).up()
            .ele("cer:dgvBeneficiario", `${dverificador}`).up()
            .ele("cer:canal", "1")
            .end({pretty: true});

        const response = await soapRequest({url: url, headers: headers, xml: xml});
        const responseXML = convert.xml2json(response.response.body);
        const parseXMLToJSON = JSON.parse(responseXML);
        const paciente = parseXMLToJSON.elements[0].elements[1].elements[0].elements[0].elements[9].elements;

        res.json({
            run: `${paciente[0].elements[0].text}-${paciente[1].elements[0].text}`,
            nombre: paciente[2].elements[0].text,
            apellido_paterno: paciente[3].elements[0].text,
            apellido_materno: paciente[4].elements[0].text,
            fecha_nacimiento: paciente[5].elements[0].text
        });
    } catch(error) {
        res.json({
            ok: false
        });
    }
}

module.exports = {
    obtenerPaciente
}

const BuscarPersonaBrazalete = async(req, res = response) => {
    const { run } = req.body;
    if(!run || run === '' || run === undefined){
        return res.json({
            ok: false,
            msg: "Error en uno de los campos"
        })
    }
    try {
        const resp = await buscarPacienteBrazaleteDB(run);
        res.json(resp)
    } catch (error) {
        res.json(error)
    }
}

const obenerInformacionPaciente = async(req, res = response) => {
    const { idPaciente } = req.body;
    try {
        const resp = await informacionPaciente(idPaciente);
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


const VerificarExistePaciente = async(req, res = response) => {
    const { run } = req.body;
    try {
        const resp = await verificarPaciente(run);
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

const obtenerultimaFechaAltaYtotalEva = async(req, res = response) => {
    const { idPaciente } = req.body;
    try {
        const resp = await obtenerInformacionAdicionalPaciente(idPaciente);
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



const obtenerListadoPacientes = async(req, res = response) => {

    try {
        const response = await listadoTodosLosPacientes();
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



const registrarPaciente = async(req, res = response) => {
    const {run, nombres, apellidos, fecha_nacimiento, genero, fecha_ingreso } = req.body;
    try {
        const resp = await registrarNuevoPaciente( run, nombres, apellidos, fecha_nacimiento, genero, fecha_ingreso );
        if(resp.ok){
            return res.json({
                ok: true,
                resp
            });
        }
        return res.json({
            ok: false,
            msg: "Error al registrar paciente"
        })
    } catch (error) {
        return res.json({
            resp: error
        })
    }
}

const DarDeAltaAlPaciente = async(req, res = response) => {
    const {idPaciente } = req.body;
    try {
        const resp = await DarDeAlta(idPaciente);
        if(resp.ok){
            return res.json({
                ok: true,
                msg: "alta exitosa"
            })
        }
        return res.json(resp.resultado)
    } catch (error) {
        return res.json({
            error
        })
    }
}


const obtenerEvolucionPaciente = async(req = request, res = response) => {
    try {
       const { idPaciente } = req.body 

        const resp = await obtenerEvolucionPacienteDB(idPaciente);
        if(resp.ok){
            return res.json(resp)
        }
        return res.json({
            ok: false,
            msg: "Paciente sin evoluciones"
        })
    } catch (error) {  
        return res.json({
            ok: false,
            msg: "Paciente sin evoluciones"
        })
    }

}

const obtenerEvolucionPacienteConfirmar = async(req = request, res = response) => {
    try {
       const { id_evolucion } = req.body 

        const resp = await obtenerEvolucionPacienteConfirmarDB(id_evolucion);
        if(resp.ok){
            return res.json(resp.resultado)
        }
        return res.json({
            ok: false,
            msg: "Paciente sin evoluciones"
        })
    } catch (error) {  
        return res.json({
            ok: false,
            msg: "Paciente sin evoluciones"
        })
    }

}



const agregarEvolucion = async(req, res = response) => {
    try {
        const { id_paciente, id_medico, id_servicio, 
        diagnostico, evolucion, plan, fecha_alta, estudio_complementario, participacion_interno,nombre_interno } = req.body;
        
        const fecha = new Date();
        const fecha_registro = `${fecha.getFullYear()}-${fecha.getMonth() + 1}-${fecha.getDate()}:${fecha.getHours()}:${fecha.getMinutes()}:${fecha.getSeconds()}`;
        const resp = await agregarEvolucionPacienteDB( fecha_registro, id_paciente, id_medico, id_servicio, diagnostico,
            evolucion, plan, fecha_alta, estudio_complementario, participacion_interno, nombre_interno);
        if(resp.ok){
            return res.json({
                ok: true,
                msg: 'Evolucion agregada!'
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

const agregarEvolucionEnProceso = async(req, res = response) => {
    try {
        const { id_paciente, id_medico, id_servicio, 
            diagnostico, evolucion, plan, fecha_alta, estudio_complementario, participacion_interno,nombre_interno } = req.body;
        
        const fecha = new Date();
        const fecha_registro = `${fecha.getFullYear()}-${fecha.getMonth() + 1}-${fecha.getDate()}:${fecha.getHours()}:${fecha.getMinutes()}:${fecha.getSeconds()}`;
        
        const resp = await agregarEvolucionEnProcesoDB( fecha_registro, id_paciente, id_medico, id_servicio, diagnostico,
            evolucion, plan, fecha_alta, estudio_complementario, participacion_interno, nombre_interno );
        
        if(resp.ok){
            return res.json({
                ok: true,
                msg: 'Evolucion agregada!'
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

const consultarEstadoEvolucionPaciente = async( req, res = response ) => {
    try {
        const { idPaciente } = req.body;
        const resp = await verificarEstadoEvolucionPaciente(idPaciente);

        if(resp.ok){
            return res.json({
                ok: true,
                resp: resp.resultado
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

const listarPacientesAlta = async( req, res = response ) => {
    try {
        const resp = await listadoTodosLosPacientesAlta();
        if(resp.ok){
            return res.json(resp.resultado)
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

const obtenerEvoluciones = async( req, res = response ) => {
    try {
        const { id_paciente } = req.body;

        const resp = await verificarEvolucionesPaciente( id_paciente );
        if(resp){
            return res.json(resp);
        }
        return res.json(resp)
    } catch (error) {
        return res.json({
            ok: false,
            evoluciones: false
        })
    }
}

const obtenerIdPaciente = async( req, res = response ) => {
    try {
        const { run } = req.body;
        if(!run || run === '' || run === undefined){
            return res.json({
                ok: false,
                msg: 'Error en uno de los campos'
            })
        }
        const resp = await obtenerPacienteDB( run );

        if(resp){
            return res.json(resp.resultado)
        }
        return res.json({
            ok: false
        })
    } catch (error) {
        return res.json({
            ok: false
        })
    }
}

const obtenerIdDePaciente = async( req, res = response ) => {
    try {
        const { id_evolucion } = req.body;
        if(!id_evolucion || id_evolucion === '' | id_evolucion === undefined){
            return res.json({
                ok: false,
                msg: "Error en uno de los campos"
            })
        }
        const resp = await obtenerPacienteIdPaciente(id_evolucion);
        if(resp.ok){
            return res.json(resp)
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

const obtenerPacienteFonasa = async(req, res = response) => {
    try {
        let { run, dverificador } = req.body;

        run = run.split("-");

        let xml = xmlBuilder
            .create("soapenv:Envelope")
            .att("xmlns:soapenv", "http://schemas.xmlsoap.org/soap/envelope/")
            .att("xmlns:cer", "http://certificadorprevisional.fonasa.gov.cl.ws/")
            .ele("soapenv:Header").up()
            .ele("soapenv:Body")
            .ele("cer:getCertificadoPrevisional")
            .ele("cer:query")
            .ele("cer:queryTO")
            .ele("cer:tipoEmisor", "10").up()
            .ele("cer:tipoUsuario", "1").up().up()
            .ele("cer:entidad", "61606407").up()
            .ele("cer:claveEntidad", "6160").up()
            .ele("cer:rutBeneficiario", `${run[0]}`).up()
            .ele("cer:dgvBeneficiario", `${dverificador}`).up()
            .ele("cer:canal", "1")
            .end({pretty: true});

        const response = await soapRequest({url: url, headers: headers, xml: xml});
        const responseXML = convert.xml2json(response.response.body);
        const parseXMLToJSON = JSON.parse(responseXML);
        const paciente = parseXMLToJSON.elements[0].elements[1].elements[0].elements[0].elements[9].elements;

        res.json({
            run: `${paciente[0].elements[0].text}-${paciente[1].elements[0].text}`,
            nombre: paciente[2].elements[0].text,
            apellido_paterno: paciente[3].elements[0].text,
            apellido_materno: paciente[4].elements[0].text,
            fecha_nacimiento: paciente[5].elements[0].text
        });
    } catch(error) {
        res.json({
            ok: false
        });
    }
}



module.exports = {
    BuscarPersonaBrazalete,
    VerificarExistePaciente,
    registrarPaciente,
    obtenerListadoPacientes,
    obtenerPaciente,
    obenerInformacionPaciente,
    obtenerultimaFechaAltaYtotalEva,
    obtenerEvolucionPaciente,
    agregarEvolucion,
    DarDeAltaAlPaciente,
    consultarEstadoEvolucionPaciente,
    listarPacientesAlta,
    obtenerIdPaciente,
    obtenerEvoluciones,
    agregarEvolucionEnProceso,
    obtenerEvolucionPacienteConfirmar,
    obtenerIdDePaciente,
    obtenerPacienteFonasa
}