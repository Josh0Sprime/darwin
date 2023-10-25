import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from 'primeng/api';
import { EvolucionService } from '../../../../../services/evolucion.service';

@Component({
  selector: 'app-paso4',
  templateUrl: './paso4.component.html',
  styleUrls: ['./paso4.component.css']
})
export class Paso4Component {

  planForm: FormGroup = this.fb.group({
    plan: ['', Validators.required],
    editar: [false]
  })
  mensaje: Message[] = [];
  blockearTextArea: boolean = true;
  fileIcon: string = 'pi pi-file-edit'
  textAreaActivo: boolean = false;
  mensajeToolTip: string = 'Habilitar editar';
  estiloTextArea: string = 'width: 100%; background-color: rgba(160, 157, 157, 0.068);'
  idPaciente: number = 0;

  constructor(private fb: FormBuilder, private ar: ActivatedRoute, private router: Router, private es: EvolucionService){
    this.idPaciente = es._dataEvolucion[0].id_paciente

    this.es.obtenerEvolucionPaciente(this.idPaciente).subscribe((resp: any) => {
      if(resp.ok){
        (this.es._dataEvolucion[0].plan != '') ? this.planForm.patchValue({ plan: this.es._dataEvolucion[0].plan }) : 
        (resp.resultado[0].id_paciente > 0) ? this.planForm.patchValue({ plan: resp.resultado[0].plan }) : false;
        return;
      }
      if(!resp.ok){
        this.es.obtenerEvolucionConfirmar( this.idPaciente ).subscribe(resp => {
          if(resp.length <= 0 || resp[0].id_estado != 1){

            return
          }
          this.es._dataEvolucion[0].plan === '' ? this.planForm.patchValue({plan: resp[0].plan}) : 
          this.planForm.patchValue({plan: this.es._dataEvolucion[0].plan});
          return;
        })
        if(this.es._dataEvolucion[0].plan != ''){
          this.planForm.patchValue({
            plan: this.es._dataEvolucion[0].plan 
          })
        }
        this.planForm.patchValue({
          editar: true
        })
        this.blockearTextArea = false;
        this.estiloTextArea = 'width: 100%;';
      }
     

    })
    

  }


  siguiente(){
    if(this.planForm.valid){
      const { plan } = this.planForm.value;

      this.es._dataEvolucion[0].plan = plan;
      this.router.navigate(['inicio/pacientes/agregarEvolucion/paso5', this.idPaciente])
    }else{
      this.mensaje = [{severity: "error", summary:"Por favor completar estudio para poder continuar."}]
      setTimeout(() => {
        this.mensaje = [];
      }, 2000);
    }
  }
  habilitarTextArea(){
    this.textAreaActivo === false ? 
    (this.fileIcon = 'pi pi-file-excel', this.blockearTextArea = false, this.textAreaActivo = true, this.mensajeToolTip = 'Deshabilitar editar' ,
    this.estiloTextArea = 'width: 100%') :
    (this.fileIcon = 'pi pi-file-edit', this.blockearTextArea = true, this.textAreaActivo = false, this.mensajeToolTip = 'Habilitar editar',
    this.estiloTextArea = 'width: 100%; background-color: rgba(160, 157, 157, 0.068);');
  }
  cambiarEstadoSwitch(){
    const { editar } = this.planForm.value;
    editar ? (this.estiloTextArea = 'width: 100%;',
    this.blockearTextArea = false)  
    : (this.estiloTextArea = 'width: 100%; background-color: rgba(160, 157, 157, 0.068);',
    this.blockearTextArea = true,  this.estiloTextArea = 'width: 100%; background-color: rgba(160, 157, 157, 0.068)');
    
  }
  
}
