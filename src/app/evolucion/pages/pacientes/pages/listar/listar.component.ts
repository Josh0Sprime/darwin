import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Paciente } from '../../interfaces/paciente.interface';
import { EvolucionService } from '../../../../services/evolucion.service';
import { ConfirmationService, MessageService, MenuItem } from 'primeng/api';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {

  pacientes: Paciente[] = [];
  pacientesAlta: Paciente [] = [];
  pacientesFiltro: Paciente[] = [];
  pacientesFiltroAlta: Paciente[] = [];

  itemsMenu: MenuItem[] = [];
  mostrarDatosTabla: boolean = true;
  tablaHospitalizados: boolean = true;
  tablaAltaPacientes: boolean = false;
  menuActivo!: MenuItem;

  fecha_ingreso:string = "";

  constructor(private router: Router, private evs: EvolucionService, private cs: ConfirmationService,  private ms: MessageService ) { }

  ngOnInit(): void {
    this.CargarTablaPacientes();
    this.cargarTablaAlta();
    this.itemsMenu = [
      {
        label: 'Hospitalizados',
        command: () => this.ocultarAltaPacientes()
      },
      {
        label: 'De alta',
        command: () => this.ocultarHospitalizados()
      }
    ]
    this.menuActivo = this.itemsMenu[0];

  }

  ocultarHospitalizados(){
    this.tablaHospitalizados = false;
    this.tablaAltaPacientes = true;
  }

  ocultarAltaPacientes(){
    this.tablaHospitalizados = true;
    this.tablaAltaPacientes = false;
  }

  formatDate = (date:Date) => {
    let formatted_date = date.getDate()+1 + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()
     return formatted_date;
  }

  cargarTablaAlta(){
    this.evs.obtenerPacientesAlta().subscribe(resp => {
      this.pacientesAlta = resp;
      this.pacientesFiltroAlta = resp;
    })
  }

  restaFechas = function(f1:any, f2:any) {
    var aFecha1 = f1.split('-');
    var aFecha2 = f2.split('-');
    var fFecha1 = Date.UTC(aFecha1[2],aFecha1[1]-1,aFecha1[0]);
    var fFecha2 = Date.UTC(aFecha2[2],aFecha2[1]-1,aFecha2[0]);
    var dif = fFecha2 - fFecha1;
    var dias = Math.floor(dif / (1000 * 60 * 60 * 24));
    return dias;
  }

  verEvoluciones(){
    this.router.navigate(['inicio/evoluciones']);
  }

  

  CargarTablaPacientes(){
    this.evs.ListadoTodosLosPacientes().subscribe(response => {
      if(response.ok === false){
        this.mostrarDatosTabla = false;
        return;
      }

      let fecha = Date.now();
      let hoy = new Date(fecha);
      let hoyFormateado:string = hoy.toLocaleDateString().toString();

      let data_pacientes = response.map((res: Paciente) => {

        //variables para obtener las fechas de ingreso de los pacientes
        res.fecha_ingreso = res.fecha_ingreso!.slice(0, 'yyyy-mm-dd'.length);

        let fechaDate = new Date(res.fecha_ingreso); 
        let fechaFromateada = this.formatDate(fechaDate);
        
        let DiasDiferencia = this.restaFechas(fechaFromateada,hoyFormateado);

        if(DiasDiferencia === 0) {
          res.dias_hospitalizacion = 'Recien ingresado'
        } else {
          res.dias_hospitalizacion = `${DiasDiferencia} días`
        }
        return res;
      });

      this.pacientes = data_pacientes;
      this.pacientesFiltro = data_pacientes
      this.mostrarDatosTabla = false;

    });
  }


  DarAltaPaciente(idPaciente: number) {
    this.CargarTablaPacientes();
  }

  filtroTablaPacientes(valor: any){
    this.pacientes = this.pacientesFiltro;
    this.pacientes = this.pacientes.filter(resp => resp.run.toLowerCase().includes(valor) || resp.apellidos.toLowerCase().includes(valor) || 
    resp.estado_paciente!.toLowerCase().includes(valor) || resp.nombres.toLowerCase().includes(valor));

    this.pacientesAlta = this.pacientesFiltroAlta;
    this.pacientesAlta = this.pacientesAlta.filter(resp => resp.run.toLowerCase().includes(valor) || resp.apellidos.toLowerCase().includes(valor) || 
    resp.estado_paciente!.toLowerCase().includes(valor) || resp.nombres.toLowerCase().includes(valor));
  }


  recargarTablaPacientes(){
    this.CargarTablaPacientes();
  }
}

