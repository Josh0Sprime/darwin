import { Component, resolveForwardRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EvolucionService } from '../../../services/evolucion.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Medico } from '../interfaces/medicos';
import { RespuestaRol } from '../interfaces/respuestaRol.interface';
import { RutService } from 'src/app/evolucion/services/rut.service';

@Component({
  selector: 'app-mantenedor',
  templateUrl: './mantenedor.component.html',
  styleUrls: ['./mantenedor.component.css'],
})
export class MantenedorComponent {

  cargando: boolean = false;
  roles: RespuestaRol[] = [];
  medicos: Medico[] = [];
  display: boolean = false;
  errorCampos: boolean = false;
  barraCargando: boolean = false;

  medicosFiltro!: Medico[];

  mostrarDatosTabla: boolean = true;

  medicoForm: FormGroup = this.fb.group({
    run: [""],
    nombres: ["", Validators.required],
    apellidos: ["", Validators.required],
    rol: [1, Validators.required]
  });

  constructor(private sv: EvolucionService, private fb: FormBuilder, private msg: MessageService,
    private cs: ConfirmationService, private runService: RutService) {
    sv.obtenerMedicos().subscribe(resp => {
      this.medicos = resp;
      this.medicosFiltro = resp;
      this.mostrarDatosTabla = false;
    })
  }

  buscarMedico() {
    this.cargando = true;

    let run = this.medicoForm.controls["run"].value;

    if (!run) {
      this.msg.add(
        {
          severity: "warn",
          summary: "RUN",
          detail: "Debe proveer un RUN a buscar"
        }
      );
      return;
    }

    this.sv.ObtenerPacienteAPI(this.medicoForm.value["run"]).subscribe(
      {
        next: (paciente) => {
          this.barraCargando = false;
          this.medicoForm.patchValue({
            nombres: `${paciente.nombre}`,
            apellidos: `${paciente.apellido_paterno} ${paciente.apellido_materno}`
          });
        },
        error: (error) => {
          this.barraCargando = false;
          this.msg.add(
            {
              severity: "error",
              summary: "Ha ocurrido un problema",
              detail: error.error
            }
          );
        },
        complete: () => {
        }
      }
      //   resp => {
      //   if(resp.nombre === undefined) {
      //     this.msg.add({severity: "error", summary: "Ha ocurrido un problema", detail: "No se ha encontrado el usuario, por favor ingresar manualmente"})
      //     this.cargando = false;
      //   } else {
      //     this.medicoForm.patchValue({
      //       nombres: `${resp.nombre}`,
      //       apellidos: `${resp.apellido_paterno} ${resp.apellido_materno}`
      //     });
      //     this.cargando = false;
      //   }
      // }
    );
  }

  modalMedico() {
    this.display = true;
    this.sv.obtenerRoles().subscribe(resp => {
      this.roles = resp;

    })
  }

  agregarMedico() {
    if (this.medicoForm.valid) {
      let { run, nombres, apellidos, rol } = this.medicoForm.value;
      let password: string;
      password = run.substring(0, 5);

      this.cs.confirm({
        message: '¿Esta seguro de agregar este usuario?',
        accept: () => {
          this.sv.crearUsuario(password, run, nombres, apellidos, rol).subscribe(resp => {
            if (resp.ok) {
              this.msg.add({ severity: "success", summary: "Exito!", detail: "Usuario creado correctamente!" })
              this.medicoForm.patchValue({
                run: "",
                nombres: "",
                apellidos: "",
                password: "",
                rol: 1
              });

              this.display = false;
              location.reload();
            } else {
              this.msg.add(
                {
                  severity: "error",
                  summary: "Ha ocurrido un problema",
                  detail: "Este usuario ya existe."
                }
              );
              this.medicoForm.patchValue({
                run: "",
                nombres: "",
                apellidos: "",
                password: "",
                pasaporte: "",
                rol: 2
              });
              this.errorCampos = false;
            }
          });
        }
      })
    } else {
      this.msg.add({ severity: 'error', detail: 'Por favor completar campos para poder continuar.' })
      this.errorCampos = true;
    }
  }

  recargarTabla() {
    location.reload();
  }

  BuscarPersona = () => {
    this.cargando = true;

    let run = this.medicoForm.controls["run"].value;

    if (!run) {
      this.msg.add(
        {
          severity: "warn",
          summary: "RUN",
          detail: "Debe proveer un RUN a buscar"
        }
      );
      return;
    }

    this.sv.obtenerPacienteFonasa(this.medicoForm.value["run"]).subscribe(resp => {
      if (resp.nombre === undefined) {
        this.msg.add({severity: "error", summary: "Ha ocurrido un problema", detail: "No se ha encontrado el usuario, por favor ingresar manualmente"});
      }else{
        this.barraCargando = false;
        this.medicoForm.patchValue({
          nombres: `${resp.nombre}`,
          apellidos: `${resp.apellido_paterno} ${resp.apellido_materno}`
        });
      }
    });

    // this.evs.obtenerPacienteFonasa(run).subscribe(resp => {
    //   if (resp.nombre === undefined) {
    //       this.ms.add({severity: "error", summary: "Ha ocurrido un problema", detail: "No se ha encontrado el usuario, por favor ingresar manualmente"});
    //   } else {
    //     this.Fonasa = true;
    //     this.nuevoPaciente.patchValue({
    //       nombres: `${resp.nombre}`,
    //       apellidos: `${resp.apellido_paterno} ${resp.apellido_materno}`,
    //       fecha_nacimiento: `${resp.fecha_nacimiento}`
    //     });
    //   }
    // });
  }

  public formatearRun(){
    let run: string = this.medicoForm.get('run')?.value;
    run = this.runService.formatearRUN(run);
    this.medicoForm.controls['run'].setValue(run);
  }

  filtroTablaMedicos(event: any) {
    const valor: string = event.target.value.toLowerCase();
    this.medicos = this.medicosFiltro;
    this.medicos = this.medicos.filter((resp: any) => resp.run.toLowerCase().includes(valor) || resp.nombres.toLowerCase().includes(valor) ||
      resp.apellidos.toLowerCase().includes(valor) || resp.estado.toLowerCase().includes(valor));
  }
}
