import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EvolucionService } from 'src/app/evolucion/services/evolucion.service';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-paso2',
  templateUrl: './paso2.component.html',
  styleUrls: ['./paso2.component.css']
})
export class Paso2Component {

  idPaciente: number;
  mensaje!: Message[];
  evolucionForm: FormGroup = this.fb.group({
    evolucion: ["", Validators.required]
  })

  constructor(private router: Router, private sv: EvolucionService, private fb: FormBuilder){
    let ruta = this.router.url;
    let ruta_split = ruta.split('/');
    this.idPaciente = parseInt(ruta_split[5]);
    // this.sv.obtenerEvolucionPaciente(this.idPaciente).subscribe((resp: any) => {
    //   if(resp.ok){
    //     if(resp.resultado[0].estadoEvolucion === 1){
    //       return;
    //     }
    //     sv._dataEvolucion[0].fecha_alta = resp.resultado[0].fecha_alta;

    //   }
    //   if(!resp.ok){
    //     this.sv.obtenerEvolucionConfirmar( this.idPaciente ).subscribe(resp => {
    //       if(resp.length <= 0 || resp[0].id_estado != 1){
    //         return
    //       }else{
    //         if(this.sv._dataEvolucion[0].evolucion != ''){
    //           this.evolucionForm.patchValue({
    //             evolucion:  this.sv._dataEvolucion[0].evolucion
    //           })
    //           sv._dataEvolucion[0].fecha_alta = resp[0].fecha_alta;
    //           return;
    //         }
    //         resp.length <= 0 ? false : this.evolucionForm.patchValue({ evolucion: resp[0].evolucion });
    //         sv._dataEvolucion[0].fecha_alta = resp[0].fecha_alta;
    //         return;
    //       }
    //     }
    //     )
    //     if(this.sv._dataEvolucion[0].evolucion != ''){
    //       this.evolucionForm.patchValue({
    //         evolucion: this.sv._dataEvolucion[0].evolucion
    //       })
    //     }
    //   }
     

    // })
    
    this.sv._dataEvolucion[0].diagnostico != '' ? this.evolucionForm.patchValue({ evolucion: this.sv._dataEvolucion[0].evolucion }): false;

  }
  ngOnInit(): void {
    
  }

  siguientePaso(){
    if(this.evolucionForm.valid){
      const { evolucion } = this.evolucionForm.value;
      this.sv._dataEvolucion[0].evolucion = evolucion;

      this.router.navigate(['inicio/pacientes/agregarEvolucion/paso3', this.idPaciente])
    }else{
      this.mensaje = [{severity:"error", summary:"Por favor ingresar evolucion para continuar."}]
      setTimeout(() => {
        this.mensaje = [];
      }, 2000);
    }
  }
}
