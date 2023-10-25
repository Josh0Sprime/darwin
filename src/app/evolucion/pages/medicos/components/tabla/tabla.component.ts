import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EvolucionService } from '../../../../services/evolucion.service';
import { EstadoMedico } from '../../interfaces/medicos';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RespuestaRol } from '../../interfaces/respuestaRol.interface';

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css'],
  providers: [ConfirmationService]
})

export class TablaComponent {
  
  displayModificar: boolean = false;

  estadoMedico!: EstadoMedico[];
  
  @Input() mostrarDatosTabla: boolean = false;
  roles: RespuestaRol[] = [];

  @Input() medicos: any[] = [];
  @Output() recargarTabla = new EventEmitter<any>();

  display: boolean = false;


  modificarMedicoForm: FormGroup =  this.fb.group({
    nombres  : ["", Validators.required],
    apellidos: ["", Validators.required],
    id       : ["", Validators.required],
    id_medico: ["", Validators.required],
    run      : ["", Validators.required],
    rol: ["", Validators.required]
  })

  constructor(private sv: EvolucionService, private fb: FormBuilder, private msg: MessageService,
    private cs: ConfirmationService) { }

  runMedico!: number;

  mostrarModalModificar(id: number, id_estado: number) {
    

    this.sv.obtenerRoles().subscribe(resp => {
      this.roles = resp;
      this.sv.obtenerDatosMedicos(id).subscribe(resp => {
        this.modificarMedicoForm.patchValue({
          rol: resp[0].id_rol
        })
        this.modificarMedicoForm.patchValue({
        nombres: resp[0].nombres,
        apellidos: resp[0].apellidos,
        id_medico: resp[0].id,
        run: resp[0].run
       });
      });
    });

    this.sv.obtenerEstadoMedico(id_estado).subscribe(resp => {
      const datos = resp.map(resp => {
        if(resp.nombre === "HABILITADO") {
          resp.nombre_contrario = "DESHABILITADO"
        }

        if(resp.nombre === "DESHABILITADO") {
          resp.nombre_contrario = "HABILITADO"
        }

        if(resp.id === 1) {
          resp.id_contrario = 2;
        }

        if(resp.id === 2) {
          resp.id_contrario = 1;
        }
        return resp;
      });

      this.estadoMedico = datos;
      this.modificarMedicoForm.patchValue({
          id: resp[0].id
        });
    });

    this.displayModificar = true;
  }

  modificarMedico() {
    this.cs.confirm({
      message: '¿Desea modificar este usuario?',
      accept: () => {
        if(this.modificarMedicoForm.valid) {
          const { nombres, apellidos, id, id_medico, run, rol } = this.modificarMedicoForm.value;
          this.sv.modificarMedico(nombres, apellidos, id_medico, id, run, rol).subscribe(resp => {
            this.recargarTabla.emit();
            this.msg.add(
              {
                severity: "success", 
                summary: "Exito!", 
                detail: "Se ha modificado al usuario correctamente."
              }
            );
            this.medicos = [];
            this.displayModificar = false;
          });
        } else {
          this.msg.add({severity: "error", summary: "Ha ocurrido un error", detail: "Ocurrio un problema actualizando el usuario."})
        }
      }
    });
  }
}
