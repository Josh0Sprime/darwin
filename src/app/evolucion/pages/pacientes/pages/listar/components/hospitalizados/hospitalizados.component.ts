import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Paciente } from '../../../../interfaces/paciente.interface';
import { EvolucionService } from '../../../../../../services/evolucion.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-hospitalizados',
  templateUrl: './hospitalizados.component.html',
  styleUrls: ['./hospitalizados.component.css']
})
export class HospitalizadosComponent {

  @Input() pacientes: Paciente[] = [];
  @Input() mostrarDatosTabla: boolean = false;
  @Output() darDeAlta = new EventEmitter<number>();

  constructor( private ev: EvolucionService, private cs: ConfirmationService, private ms: MessageService ){
    ev.setIdPaciente = 0;
  }

  capturarIdPaciente(id: number){
    this.ev.setIdPaciente = id;
  }

  DarAltaPaciente(id: number){
    this.cs.confirm({
      message: '¿Está seguro que desea dar de alta a este paciente?',
      key: 'darDeAlta',
      accept: () => {
        // this.ev.verificarEvolucionesPaciente( id ).subscribe(resp => {
        //   if(resp.evoluciones){
        //     this.ev.DarDeAlta(id).subscribe((response: any) => {
        //       if (response.ok) {
        //         this.ms.add({
        //           severity:'success', 
        //           summary:'Alta exitosa', 
        //           detail:'El paciente ha sido dado de alta.'
        //         });
        //         this.darDeAlta.emit(id);
        //       } 
    
        //       else if(response.error?.apto === false){
        //         this.ms.add(
        //           {
        //             severity:'error', 
        //             summary:'Error al dar de alta', 
        //             detail:'Este paciente posee evoluciones pendientes.'
        //           }
        //         );
        //       }
        //       else {
        //         this.ms.add(
        //           {
        //             severity:'error', 
        //             summary:'Error al dar de alta', 
        //             detail:'Ha ocurrido un error inesperado, Por favor intente nuevamente.'
        //           }
        //         );
        //       }
        //     })
        //   }else{
        //     this.ms.add(
        //       {
        //         severity:'error', 
        //         summary:'Error al dar de alta', 
        //         detail:'No se puede dar de alta a este paciente.'
        //       }
        //     );
        //   }
        // })
        
      }
    });
  }
}
