import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { LoginService } from 'src/app/login/services/login.service';
import { EvolucionService } from '../../../../services/evolucion.service';
import { RutService } from 'src/app/evolucion/services/rut.service';


@Component({
  selector: 'app-agregar-paciente',
  templateUrl: './agregar-paciente.component.html',
  styleUrls: ['./agregar-paciente.component.css']
})
export class AgregarPacienteComponent {

  modalPaciente: boolean = false;
  barraCargando: boolean = false;

  @Output() recargarTabla = new EventEmitter();

  @Output() valorInput = new EventEmitter<string>();

  arrayPersona = [];
  Fonasa: boolean = true;

  genero = [
    {
      valor: "MASCULINO"
    },
    {
      valor: "FEMENINO"
    },
    {
      valor: "INDETERMINADO"
    },
    {
      valor: "OTRO"
    }
  ];

  constructor(private fb: FormBuilder, private evs: EvolucionService, private ms: MessageService, private cs: ConfirmationService,
    private route: Router, private ls: LoginService, private runService: RutService) { }

  nuevoPaciente: FormGroup = this.fb.group({
    run: ['', [Validators.required, Validators.minLength(5)]],
    nombres: ['', [Validators.required, Validators.minLength(3)]],
    apellidos: ['', [Validators.required, Validators.minLength(3)]],
    fecha_nacimiento: ['', [Validators.required, Validators.minLength(3)]],
    genero: ['', [Validators.required, Validators.minLength(3)]],
    fecha_ingreso: ['', [Validators.required, Validators.minLength(3)]],
    social: ['']
  });

  ModalPaciente = () => {
    this.modalPaciente = true;

    const Hoy = new Date();
    let dia = Hoy.getDate();
    let mes = Hoy.getMonth()+1;
    let anio = Hoy.getFullYear();
    let fechaFormateada = `${anio}-${mes}-${dia}`;
    if(mes < 10){
      fechaFormateada = `${anio}-0${mes}-${dia}`;
    }
    
    this.nuevoPaciente.patchValue({
      fecha_ingreso: fechaFormateada
    })
    
  }

  BuscarPersona = () => {
    let run = this.nuevoPaciente.controls["run"].value;

    if (!run) {
      this.ms.add(
        {
          severity: "warn",
          summary: "RUN",
          detail: "Debe proveer un RUN a buscar"
        }
      );
      return;
    }

    this.barraCargando = true;
    this.evs.obtenerPacienteFonasa(run).subscribe(resp => {
      if (resp.nombre === undefined) {
          this.ms.add({severity: "error", summary: "Ha ocurrido un problema", detail: "No se ha encontrado el usuario, por favor ingresar manualmente"});
      } else {
        this.Fonasa = true;
        this.barraCargando = false;
        this.nuevoPaciente.patchValue({
          nombres: `${resp.nombre}`,
          apellidos: `${resp.apellido_paterno} ${resp.apellido_materno}`,
          fecha_nacimiento: `${resp.fecha_nacimiento}`
        });
      }
    });
  }

  get IdMedico() {
    return this.ls.Getid_usuario;
  }

  agregarPaciente() {
    let fechaHoy = new Date();
    let fecha_ingreso = this.nuevoPaciente.controls["fecha_ingreso"].value;
    let fechaIngreso = new Date(fecha_ingreso);

    if (!this.nuevoPaciente.valid) {
      this.ms.add({
        severity: 'error',
        summary: 'Hay campos sin completar',
        detail: 'favor revise e intente nuevamente.'
      });
    }
    else if (fechaIngreso > fechaHoy) {
      this.ms.add({
        severity: 'error',
        summary: 'Error al ingresar fecha de ingreso',
        detail: 'No puede ser superior a la fecha actual'
      });

    }
    else {
      this.cs.confirm({
        message: '¿Esta seguro de agregar a este paciente?',
        key: 'agregarPaciente'
      })
    }
  }

  confirmarAgregarPaciente() {
    let {
      run,
      nombres,
      apellidos,
      fecha_nacimiento,
      genero,
      fecha_ingreso,
      social
    } = this.nuevoPaciente.value;

    if (social != '') {
      nombres = `(${social.toUpperCase()}) ${nombres}`;
    }

    const date = new Date();
    const hora = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    fecha_ingreso = `${fecha_ingreso} ${hora}`;
    this.evs.AgregarPaciente(
      run,
      nombres.toUpperCase(),
      apellidos.toUpperCase(),
      fecha_nacimiento,
      genero.toUpperCase(),
      fecha_ingreso
    ).subscribe(response => {
      if (!response.resp.ok) {
        this.ms.add({
          severity: 'error',
          summary: 'Error al registrar episodio.',
          detail: 'Este paciente posee un episodio activo.'
        });
      } else {
        this.ms.add({
          severity: 'success',
          summary: 'Ingreso exitoso!',
          detail: 'Se ha registrado un nuevo episodio.'
        });
        this.cs.close();
        this.nuevoPaciente.reset();
        this.modalPaciente = false;
        this.recargarTabla.emit();
      }
    });
  }

  confirmarYRedireccionar() {
    let {
      run,
      nombres,
      apellidos,
      fecha_nacimiento,
      genero,
      fecha_ingreso
    } = this.nuevoPaciente.value;

    const date = new Date();
    const hora = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    fecha_ingreso = `${fecha_ingreso} ${hora}`;
    this.evs.AgregarPaciente(
      run,
      nombres.toUpperCase(),
      apellidos.toUpperCase(),
      fecha_nacimiento,
      genero.toUpperCase(),
      fecha_ingreso
    ).subscribe(response => {
      if (!response.resp.ok) {
        this.ms.add({
          severity: 'error',
          summary: 'Error al registrar episodio.',
          detail: 'Este paciente posee un episodio activo.'
        });
      } else {
        this.evs.obtenerIdPaciente(run).subscribe(resp => {
          const run_paciente = resp[0].id;
          this.evs._dataEvolucion[0].diagnostico = '';
          this.evs._dataEvolucion[0].evolucion = '';
          this.evs._dataEvolucion[0].fecha_alta = '';
          this.evs._dataEvolucion[0].fecha_registro = '';
          this.evs._dataEvolucion[0].id_medico = 0;
          this.evs._dataEvolucion[0].id_paciente = 0;
          this.evs._dataEvolucion[0].id_servicio = 0;
          this.evs._dataEvolucion[0].plan = '';
          this.evs.setIdPaciente = run_paciente;
          this.evs._dataEvolucion[0].id_medico = this.IdMedico;

          this.route.navigate(['inicio/pacientes/agregarEvolucion/paso1', run_paciente])
        })
      }
    });
  }

  public formatearRun(){
    let run: string = this.nuevoPaciente.get('run')?.value;
    run = this.runService.formatearRUN(run);
    this.nuevoPaciente.controls['run'].setValue(run);
  }

  rechazarAgregarPaciente() {
    this.cs.close();
  }
  // this.ms.add({severity:'error', summary:'Paciente ya se encuentra registrado', detail:'No es necesario registrarlo'});


  enviaValorInputBuscar(event: any) {
    const valor: string = event.target.value.toLowerCase();
    this.valorInput.emit(valor);
  }


}
