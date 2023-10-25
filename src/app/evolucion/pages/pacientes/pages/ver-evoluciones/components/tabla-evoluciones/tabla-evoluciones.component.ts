import { Component } from '@angular/core';
import { Evolucion } from '../../../../interfaces/evaluacion.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EvolucionService } from '../../../../../../services/evolucion.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { jsPDF } from 'jspdf';
const pdfMake = require("pdfmake/build/pdfmake");
const pdfFonts = require("pdfmake/build/vfs_fonts");
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-tabla-evoluciones',
  templateUrl: './tabla-evoluciones.component.html',
  styleUrls: ['./tabla-evoluciones.component.css']
})
export class TablaEvolucionesComponent {

  idPaciente: number;
  evoluciones: Evolucion[] = [];
  Array_detalleEvolucion: Evolucion[] = [];
  modalDetalle: boolean = false;
  verEvolucionConfirmada: boolean = false;
  detalle_evolucion: any[] = [];

  constructor(private fb: FormBuilder, private router: Router, private evs: EvolucionService, private  ms:MessageService, private rutaActiva: ActivatedRoute,
    private cs: ConfirmationService ) { 
    const { id } = rutaActiva.snapshot.params;
    this.idPaciente = id;

    this.evs.obtenerEvolucionesPaciente(this.idPaciente).subscribe(response => {
      this.evoluciones = response;
    })
  }

  detalleEvolucion:FormGroup = this.fb.group({
    medico:           ['',  [Validators.required, Validators.minLength(5)]],
    servicio:         ['',  [Validators.required, Validators.minLength(3)]],
    diagnostico:      ['',  [Validators.required, Validators.minLength(3)]],
    evolucion:        ['',  [Validators.required, Validators.minLength(3)]],
    plan:             ['',  [Validators.required, Validators.minLength(3)]],
    fecha_alta:       ['',  [Validators.required, Validators.minLength(3)]],
    estudio:          ['', Validators.required]
  });

  verDetalleEvolucion = (idEvolucion: number) => {
    this.modalDetalle = true

    this.evs.obtenerDetalleDeEvolucion(idEvolucion).subscribe( response =>{
      this.Array_detalleEvolucion = response;
    
      let nombre_medico = `${this.Array_detalleEvolucion[0].nombres_medico?.split(' ',1)} ${this.Array_detalleEvolucion[0].apellidos_medico}`;
  
      this.detalleEvolucion.controls["medico"].setValue(nombre_medico);
      this.detalleEvolucion.controls["servicio"].setValue(this.Array_detalleEvolucion[0].nombre_servicio);
      this.detalleEvolucion.controls["fecha_alta"].setValue( new Date(this.Array_detalleEvolucion[0].fecha_alta).toLocaleDateString());
      this.detalleEvolucion.controls["diagnostico"].setValue(this.Array_detalleEvolucion[0].diagnostico);
      this.detalleEvolucion.controls["evolucion"].setValue(this.Array_detalleEvolucion[0].evolucion);
      this.detalleEvolucion.controls["plan"].setValue(this.Array_detalleEvolucion[0].plan);
      this.detalleEvolucion.controls["estudio"].setValue(this.Array_detalleEvolucion[0].estudios_complementarios);

    })
  }


  intentoPegar = () =>{
  this.ms.add({
    severity:'error', 
    summary:'Acción no permitida', 
    detail:'No se permite pegar texto'});
  }

  cerrarModal(){
    this.modalDetalle = false;
  }
  
  confirmarEvolucion(idEvolucion: number, idMedico: number){
    this.router.navigate(['/inicio/pacientes/agregarEvolucion/paso1', idEvolucion]);
    this.evs.setIdPaciente = this.idPaciente;
    this.evs._dataEvolucion[0].id_medico = idMedico;
   
  }


  // obtener detalle completo de la evolucion para el pdf
  async detalle_evolucion_pdf(idEvolucion:number){
   const response = await this.evs.obtenerTodosLosDetallesEvolucionPDFActual(idEvolucion).toPromise();
   this.detalle_evolucion = response;
   this.GenerarPDF();

  }

  formatearFecha(fechaString: string) {
    const fechaObjeto: Date = new Date(fechaString);

    const dia: number = fechaObjeto.getDate();
    const mes: number = fechaObjeto.getMonth() + 1;
    const anio: number = fechaObjeto.getFullYear();
  
    const mesFormateado: string = mes.toString().padStart(2, "0");
    const fechaStringNueva: string = `${dia}-${mesFormateado}-${anio}`;
  
    return fechaStringNueva;
  }


  GenerarPDF = () => {


    //DATOS CABECERA
    let nombreCompletoPaciente = `${this.detalle_evolucion[0].nombres_paciente} ${this.detalle_evolucion[0].apellidos_paciente}`;
    let run_paciente = this.detalle_evolucion[0].run_paciente;
    let fechaNacimiento =  new Date(this.detalle_evolucion[0].fecha_nacimiento);
    const fechaNacimientoParaPdf = this.detalle_evolucion[0].fecha_nacimiento.slice(0, 'yyyy-mm-dd'.length).split('-').reverse().join('-');

    let fechaIngreso = this.detalle_evolucion[0].fecha_ingreso.slice(0, 'yyyy-mm-dd'.length).split('-').reverse().join('-');
    // let fecha_ingreso_formateada = `${date.getDate()+1}-${date.getMonth()+1}-${date.getFullYear()}`
    

    //valida cuando el dia sea menor a 10, se le antepone un 0
   
    let fecha_alta = this.detalle_evolucion[0].fecha_alta.slice(0, 'yyyy-mm-dd'.length).split('-').reverse().join('-');
    //valida cuando el dia sea menor a 10, se le antepone un 0


    let servicio = this.detalle_evolucion[0].nombre_servicio;
    let f_registro = this.detalle_evolucion[0].fecha_registro.slice(0, 'yyyy-mm-dd'.length).split('-').reverse().join('-');
  
    //calcular la edad del paciente....
    let hoy = new Date();
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    let diferenciaMeses = hoy.getMonth() - fechaNacimiento.getMonth();
    
    if(diferenciaMeses < 0 ||  ( diferenciaMeses === 0 && hoy.getDate() < fechaNacimiento.getDate() )){
      edad --;
    } 

    //datos del medico PIE DE PAGINA
    let run_medico = this.detalle_evolucion[0].run_medico;
    let nombreCompletoMedico = `${this.detalle_evolucion[0].nombres_medico} ${this.detalle_evolucion[0].apellidos_medico}`;
  
    //DATOS DE EVOLUCION MEDICA
    let diagnostico = this.detalle_evolucion[0].diagnostico;
    let evolucion = this.detalle_evolucion[0].evolucion;
    let plan = this.detalle_evolucion[0].plan;
    let estudios = this.detalle_evolucion[0].estudios_complementarios;
    let interno_medicina = this.detalle_evolucion[0].interno_medicina.toUpperCase();
    let imagen: string = 'data:image/png;base64,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'

    var documento_pdf = {

      info: {
        title: `EVOLUCIÓN DE ${nombreCompletoPaciente} ${f_registro}`,
        author: 'Darwin'
      },

      pageMargins: [40, 180, 40, 60],
      pageSize: 'LETTER',

      header: [
          { image: imagen, width: 150, margin: [430, 10, 0, 10] },
          {text: `\nEVOLUCIÓN DEL PACIENTE: ${f_registro}`, style:['titulo']},
          {text: `\n\nNOMBRE: ${nombreCompletoPaciente}`, fontSize: 10, margin: [40, 5, 40, 5]},
          {
            columns: [
              {text: `RUN: ${run_paciente}      FECHA NACIMIENTO: ${fechaNacimientoParaPdf}      EDAD: ${edad} años`,  margin: [40, 0, 40, 0], fontSize: 10},
            ]
          },
          
          {text: `FECHA INGRESO: ${fechaIngreso}    FECHA PROBABLE ALTA: ${fecha_alta}       SERVICIO: ${servicio}`, margin: [40, 10, 40, 5], fontSize: 10},
          {text: `__________________________________________________________________________________________________`,  alignment:'center'},
      ],


      content: [

        {text: 'DIAGNÓSTICO', margin: [ 0, 10, 0, 10 ], bold: true},
        {text: `${diagnostico}`, style: ['contenido'],margin: [ 0, 0, 0, 10 ], fontSize:10},
        {text: 'EVOLUCIÓN', bold: true, margin: [ 0, 10, 0, 10 ]},
        {text: `${evolucion}`, style: ['contenido'],margin: [ 0, 0, 0, 10 ], fontSize:10},
        {text: 'ESTUDIOS COMPLEMENTARIOS', bold: true, margin: [ 0, 10, 0, 10 ]},
        {text: `${estudios}`, style: ['contenido'],margin: [ 0, 0, 0, 10 ], fontSize:10},
        {text: 'PLAN', bold: true, margin: [ 0, 10, 0, 10 ]},
        {text: `${plan}`, style: ['contenido'],margin: [ 0, 0, 0, 10 ], fontSize:10},

      ],

      footer: [
        { text: `INTERNO MEDICINA: ${interno_medicina}`,style: ['footer'] ,margin: [ 40, 15, 5, 5 ]},
        {
          columns: [
            {text: `RUN MÉDICO: ${run_medico}       NOMBRE MÉDICO: ${nombreCompletoMedico}`, style: ['footer'] ,margin: [ 40, 0, 5, 0 ]}
          ]
        }
      ],

      styles: {
        titulo: {
          fontSize: 10,
          bold: true,
          alignment:'center'
        },
        cabecera: {
          fontSize: 10,
          bold: true,
          alignment:'left'
        },
        contenido: {
          italics: true,
          alignment: 'justify'
        },
        footer: {
          fontSize: 10,
          alignment: 'left',
        }
      }
      
    }

    // const pdf = pdfMake.createPdf(documento_pdf);
    pdfMake.createPdf(documento_pdf).open();
    // pdf.open();



  }

  }

