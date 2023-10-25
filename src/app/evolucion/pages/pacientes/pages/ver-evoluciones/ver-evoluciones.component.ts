import { Component, ViewChild } from '@angular/core';
import { Evolucion } from '../../interfaces/evaluacion.interface';
import { ActivatedRoute, Router, RouterLinkActive } from '@angular/router';
import { EvolucionService } from '../../../../services/evolucion.service';
import { Location } from '@angular/common';
import { Paciente } from '../../interfaces/paciente.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem, MessageService, Message } from 'primeng/api';


@Component({
  selector: 'app-ver-evoluciones',
  templateUrl: './ver-evoluciones.component.html',
  styleUrls: ['./ver-evoluciones.component.css']
})
export class VerEvolucionesComponent {

  infoPaciente: any = [];
  evoluciones: Evolucion[] = [];
  Array_detalleEvolucion: Evolucion[] = [];
  idPaciente: number = 0;
  edad:number | string = 0;
  fecha_de_ingreso:string | Date = "";
  modalDetalle: boolean = false;
  ocultarTabla: boolean = false;
  ultimaFechaAlta: string = "";
  totalEvoluciones: number = 0;
  estadoEpisodio: number = 0;
  mostrarTablaEvoluciones:boolean = true;
  mostrarTablaHistorial: boolean = false;
  paginaSinRecargar: boolean = true;

  msgs: Message[] = [];
  items!:MenuItem[];
  activateItem!: MenuItem;

  constructor(private fb: FormBuilder, private router: Router, private evs: EvolucionService, private location: Location, private  ms:MessageService,
    private rutaActiva: ActivatedRoute ) { 


      this.items = [
        { label: 'Episodio actual', 
          command: () => this.mostrarEvoluciones()
        },
        { label: 'Historial de episodios', 
          command: () => this.mostrarHistorial()
        }
      ]
      this.activateItem = this.items[0];
    //Se captura el id del paciente de la ruta
    const { id } = rutaActiva.snapshot.params;
    this.idPaciente = id;
    evs._dataEvolucion[0].id_paciente = id;
    //constular estado de ultimo episodio del paciente
    evs.consultarEstadoEpisodio(this.idPaciente).subscribe(resp => {
        if(resp.ok){
          this.estadoEpisodio = resp.resp[0].id_estado;
          if(this.estadoEpisodio === 2){
            this.msgs = [
              {
                severity: 'info',
                summary: 'Paciente sin episodio activo.'
              }
            ]
          }
        }
    })
    
    //obtener ultima fecha de alta y el total de evoluciones del paciente
    this.evs.obenerInformacionAdicionalPaciente(this.idPaciente).subscribe((response: any) =>{
      this.ultimaFechaAlta = response[0].ultimaFechaAlta
      this.totalEvoluciones = response[0].total_evoluciones;
    })

    //obtener la informacion del paciente para cargarla en el panel superior
    this.evs.obenerInformacionDelPaciente(this.idPaciente).subscribe(response =>{
      this.infoPaciente = response[0];

      this.formatearFecha(response[0].fecha_ingreso!);

      //calcular Edad
      let fecha_nacimiento =  new Date (this.infoPaciente.fecha_nacimiento);
      let hoy = new Date();
      let edad = hoy.getFullYear() - fecha_nacimiento.getFullYear();
      let diferenciaMeses = hoy.getMonth() - fecha_nacimiento.getMonth();
      if(diferenciaMeses < 0 ||  ( diferenciaMeses === 0 && hoy.getDate() < fecha_nacimiento.getDate() )){
        edad --;
      } 
      this.edad = `${edad} años`;
    })


    //obtener todas las evoluciones que posee el paciente.
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
    })
  }

  

  formatearFecha(fechaString: string) {
    const fecha = fechaString.slice(0, 'yyyy-mm-dd'.length);
    this.fecha_de_ingreso = fecha;
  }


  cerrarModal(){
    this.modalDetalle = false
  }

  volverAtras(){
    this.router.navigate(['/inicio/pacientes']);
  }


  mostrarEvoluciones(){
    this.mostrarTablaEvoluciones = true;
    this.mostrarTablaHistorial = false;
  }

  mostrarHistorial(){
    this.mostrarTablaEvoluciones = false;
    this.mostrarTablaHistorial = true;
  }

  agregarEvolucion(){
    this.evs.validarEvolucion( this.idPaciente ).subscribe(resp => {
      if(resp.ok){
        const { id } = this.rutaActiva.snapshot.params;

        this.evs.setIdPaciente = id;
        this.evs._dataEvolucion[0].diagnostico = '';
        this.evs._dataEvolucion[0].evolucion = '';
        this.evs._dataEvolucion[0].fecha_alta = '';
        this.evs._dataEvolucion[0].fecha_registro = '';
        this.evs._dataEvolucion[0].id_medico = 0;
        this.evs._dataEvolucion[0].id_paciente = 0;
        this.evs._dataEvolucion[0].id_servicio = 0;
        this.evs._dataEvolucion[0].plan = '';
        this.evs._dataEvolucion[0].estudio_complementario = '';
        this.router.navigate(['/inicio/pacientes/agregarEvolucion/paso1', this.idPaciente]);
      }else{
        this.ms.add({severity: 'error', summary: 'Error', detail: 'Se debe confirmar la ultima evolucion para generar una nueva.'})
      }
    })
  }

}
