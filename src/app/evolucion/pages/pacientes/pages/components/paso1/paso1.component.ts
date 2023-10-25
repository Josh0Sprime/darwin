import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EvolucionService } from '../../../../../services/evolucion.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Message } from 'primeng/api';
import { distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-paso1',
  templateUrl: './paso1.component.html',
  styleUrls: ['./paso1.component.css']
})
export class Paso1Component implements OnInit {

  idPaciente: number;
  fecha_alta!: string;
  mensaje!: Message[];
  blockearTextArea: boolean = true;
  fileIcon: string = 'pi pi-file-edit'
  estiloTextArea: string = 'width: 100%; background-color: rgba(160, 157, 157, 0.068);'
  checked: boolean = false;
  textAreaActivo: boolean = false;

  @Input() verEvolucionConfirmada: boolean = false;

  diagnosticoForm: FormGroup = this.fb.group({
    diagnostico: ['', Validators.required],
    editar: [false]
  })

  constructor(private router: Router, private sv: EvolucionService, private fb: FormBuilder){
    let ruta = this.router.url;
    let ruta_split = ruta.split('/');
    this.idPaciente = parseInt(ruta_split[5]);
  }
  ngOnInit(): void {
      this.sv.obtenerEvolucionPaciente(this.idPaciente).subscribe((resp: any) => {
        if(resp.ok){
          (this.sv._dataEvolucion[0].diagnostico != '') ? this.diagnosticoForm.patchValue({ diagnostico: this.sv._dataEvolucion[0].diagnostico }) : 
          (resp.resultado[0].id_paciente > 0) ? this.diagnosticoForm.patchValue({ diagnostico: resp.resultado[0].diagnostico }) : false;
          return;
        }
        if(!resp.ok){
          this.sv.obtenerEvolucionConfirmar( this.idPaciente ).subscribe(resp => {
            this.sv._dataEvolucion[0].fecha_alta = resp[0].fecha_alta;
            if(resp.length <= 0 || resp[0].id_estado != 1){
              return;
            }else{
              
              this.sv._dataEvolucion[0].diagnostico === '' ? (this.diagnosticoForm.patchValue({diagnostico: resp[0].diagnostico}),
              this.fecha_alta = resp[0].fecha_alta) : 
              this.diagnosticoForm.patchValue({diagnostico: this.sv._dataEvolucion[0].diagnostico});
              return;
            }
          })
          if(this.sv._dataEvolucion[0].diagnostico != ''){
            this.diagnosticoForm.patchValue({
              diagnostico: this.sv._dataEvolucion[0].diagnostico
            })
          }
          this.diagnosticoForm.patchValue({
            editar: true
          })
         
          this.blockearTextArea = false;
          this.estiloTextArea = 'width: 100%;';
        }
       
      })
      
     
  }

  siguientePaso(){
    if(this.diagnosticoForm.valid){
      const { diagnostico } = this.diagnosticoForm.value;
      this.sv._dataEvolucion[0].diagnostico = diagnostico;
      this.sv._dataEvolucion[0].id_paciente = this.idPaciente;
      this.sv._dataEvolucion[0].fecha_alta = this.fecha_alta;
      
      this.router.navigate(['inicio/pacientes/agregarEvolucion/paso2', this.idPaciente])
    }else{
      this.mensaje = [{severity: "error", summary:"Por favor ingresar diagnostico para continuar."}]
      setTimeout(() => {
        this.mensaje = [];
      }, 2000);
    }
  }

  cambiarEstadoSwitch(){
    const { editar } = this.diagnosticoForm.value;
    editar ? (this.estiloTextArea = 'width: 100%;',
    this.blockearTextArea = false)  
    : (this.estiloTextArea = 'width: 100%; background-color: rgba(160, 157, 157, 0.068);',
    this.blockearTextArea = true,  this.estiloTextArea = 'width: 100%; background-color: rgba(160, 157, 157, 0.068)');
    
  }

  
}
