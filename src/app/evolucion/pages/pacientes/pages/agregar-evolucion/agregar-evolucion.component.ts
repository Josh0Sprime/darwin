import { Location } from '@angular/common';
import { Component, EventEmitter, Output, OnDestroy, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MenuItem} from 'primeng/api';
import { EvolucionService } from '../../../../services/evolucion.service';

@Component({
  selector: 'app-agregar-evolucion',
  templateUrl: './agregar-evolucion.component.html',
  styleUrls: ['./agregar-evolucion.component.css']
})
export class AgregarEvolucionComponent implements OnDestroy{


  modalEvolucion = false;
  items: MenuItem[];
  activeIndex = 1;

  constructor(private fb: FormBuilder, private location: Location, private es: EvolucionService) {
    this.items = [
      {
        label: 'Diagnóstico',
        routerLink: 'paso1'
      },
      {
        label: 'Evolución',
        routerLink:'paso2'
      },
      {
        label: 'Estudio complementario',
        routerLink:'paso3'
      },
      {
        label: 'Plan',
        routerLink: 'paso4'
      },
      {
        label: 'Confirmación',
        routerLink:'paso5'
      },
    ]

  }
  ngOnDestroy(): void {
    this.es._dataEvolucion[0].diagnostico = '';
    this.es._dataEvolucion[0].estudio_complementario = '';
    this.es._dataEvolucion[0].evolucion = '';
    this.es._dataEvolucion[0].fecha_alta = '';
    this.es._dataEvolucion[0].fecha_registro = '';
    this.es._dataEvolucion[0].id_medico = 0;
    this.es._dataEvolucion[0].id_paciente = 0;
    this.es._dataEvolucion[0].id_servicio = 0;
    this.es._dataEvolucion[0].plan = '';
    this.es._dataEvolucion[0].nombre_interno = '';
    this.es._dataEvolucion[0].participacion_interno = false;

  }

  nuevaEvolucion:FormGroup = this.fb.group({
    run:                ['',  [Validators.required, Validators.minLength(5)]],
    nombres:            ['',  [Validators.required, Validators.minLength(3)]],
    apellidos:          ['',  [Validators.required, Validators.minLength(3)]],
    fecha_nacimiento:   ['',  [Validators.required, Validators.minLength(3)]],
    genero:             ['',  [Validators.required, Validators.minLength(3)]],
    fecha_ingreso:      ['',  [Validators.required, Validators.minLength(3)]],
  });

  ModalEvolucion(){

    this.modalEvolucion = true;

  }

  volverAtras = () =>{
    this.location.back();
  }


}
