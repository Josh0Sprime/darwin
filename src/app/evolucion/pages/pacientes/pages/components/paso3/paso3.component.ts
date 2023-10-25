import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { EvolucionService } from 'src/app/evolucion/services/evolucion.service';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-paso3',
  templateUrl: './paso3.component.html',
  styleUrls: ['./paso3.component.css']
})
export class Paso3Component {

  mensaje!: Message[];
  idPaciente: number;
  blockearTextArea: boolean = true;
  fileIcon: string = 'pi pi-file-edit'
  textAreaActivo: boolean = false;
  mensajeToolTip: string = 'Habilitar editar';
  estiloTextArea: string = 'width: 100%; background-color: rgba(160, 157, 157, 0.068);'

  estudiosForm: FormGroup = this.fb.group({
    estudio: ["", Validators.required],
    editar: [false]
  })

  constructor(private router: Router, private sv: EvolucionService, private fb: FormBuilder){
    this.idPaciente = sv._dataEvolucion[0].id_paciente
  }
  ngOnInit(): void {
    // this.sv.obtenerEvolucionPaciente(this.idPaciente).subscribe((resp: any) => {
    //   if(resp.ok){
    //     (this.sv._dataEvolucion[0].estudio_complementario != '') ? this.estudiosForm.patchValue({ estudio: this.sv._dataEvolucion[0].estudio_complementario }) : 
    //     (resp.resultado[0].id_paciente > 0) ? this.estudiosForm.patchValue({ estudio: resp.resultado[0].estudios_complementarios }) : false;
    //     return;
    //   }
    //   if(!resp.ok){
    //     this.sv.obtenerEvolucionConfirmar( this.idPaciente ).subscribe(resp => {
    //       if(resp.length <= 0 || resp[0].id_estado != 1){
           
    //         return
    //       }
    //       this.sv._dataEvolucion[0].estudio_complementario === '' ? this.estudiosForm.patchValue({estudio: resp[0].estudios_complementarios}) : 
    //       this.estudiosForm.patchValue({estudio: this.sv._dataEvolucion[0].estudio_complementario});
    //       return;
    //     })
        
    //     if(this.sv._dataEvolucion[0].estudio_complementario != ''){
    //       this.estudiosForm.patchValue({
    //         estudio: this.sv._dataEvolucion[0].estudio_complementario
    //       })
    //     }
    //     this.estudiosForm.patchValue({
    //       editar: true
    //     })
    //     this.blockearTextArea = false;
    //     this.estiloTextArea = 'width: 100%;';
    //   }
      

    // })
  
  }
  siguientePaso(){
    if(this.estudiosForm.valid){
      const { estudio } = this.estudiosForm.value;
      this.sv._dataEvolucion[0].estudio_complementario = estudio;

      this.router.navigate(['inicio/pacientes/agregarEvolucion/paso4', this.idPaciente])
    }else{
      this.mensaje = [{severity: "error", summary:"Por favor completar plan para poder continuar."}]
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
    const { editar } = this.estudiosForm.value;
    editar ? (this.estiloTextArea = 'width: 100%;',
    this.blockearTextArea = false)  
    : (this.estiloTextArea = 'width: 100%; background-color: rgba(160, 157, 157, 0.068);',
    this.blockearTextArea = true,  this.estiloTextArea = 'width: 100%; background-color: rgba(160, 157, 157, 0.068)');
    
  }
}
