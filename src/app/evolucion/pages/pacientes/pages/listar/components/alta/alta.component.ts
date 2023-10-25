import { Component, Input } from '@angular/core';
import { Paciente } from '../../../../interfaces/paciente.interface';
import { EvolucionService } from '../../../../../../services/evolucion.service';

@Component({
  selector: 'app-alta',
  templateUrl: './alta.component.html',
  styleUrls: ['./alta.component.css']
})
export class AltaComponent {

  @Input()pacientesAlta: Paciente[] = [];

  constructor(private evs: EvolucionService){
  }

}
