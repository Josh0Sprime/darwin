import { Component } from '@angular/core';
import { EvolucionService } from '../../services/evolucion.service';
import { EvolucionInicio } from '../../interfaces/evolucion.interface';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {
  evoluciones   : EvolucionInicio[] = [];
  altas_vencidas: EvolucionInicio[] = [];
  altas         : number = 0;
  pacientes     : number = 0;
  evolucionesHoy: number = 0;
  data          : any = {
    labels: ["Enero", "Febrero", "Marzo", "Abril", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    datasets: [
      {
        label: 'Evoluciones',
        backgroundColor: '#42A5F5',
        data: [65, 59, 80, 81, 56, 55, 40, 39, 59, 69, 19, 12]
      }
    ]
  }

  constructor(private es: EvolucionService) {
    // this.es.obtenerAltasHoy().subscribe({
    //   next : (res) => {
    //     this.evoluciones = res.res;
    //     for(let i = 0; i < this.evoluciones.length; i++){
    //       this.evoluciones[i].fecha_alta = this.formatearFecha(res.res[i].fecha_alta);
    //      }
    //   },
    //   // error: (err) => this.evoluciones = [],
    // });

    // this.es.obtenerAltas().subscribe({
    //   next : (res) => this.altas = res.res[0].contador,
    //   error: (err) => this.altas = 0,
    // });

    // this.es.obtenerPacientes().subscribe({
    //   next : (res) => this.pacientes = res.ok[0].contador,
    //   error: (err) => this.pacientes = 0,
    // });

    // this.es.obtenerEvolucionesHoy().subscribe({
    //   next : (res) => {
    //     this.evolucionesHoy = res.ok[0].contador;
    //   },
    //   error: (err) => this.evolucionesHoy = 0,
    // });

    // this.es.obtenerAltasVencidas().subscribe({
    //   next: (res) => {
    //     this.altas_vencidas = res.ok;
    //     for(let i = 0; i < this.altas_vencidas.length; i++){
    //      this.altas_vencidas[i].fecha_alta = this.formatearFecha(res.ok[i].fecha_alta);
    //     }
    //   }
    // });
  }

  formatearFecha(fechaString: string) {
    const fechaObjeto: Date = new Date(fechaString);

    const dia: number = fechaObjeto.getDate();
    const mes: number = fechaObjeto.getMonth() + 1;
    const anio: number = fechaObjeto.getFullYear();
   
    const diaFormateado: string = dia.toString().padStart(2, "0");
    const mesFormateado: string = mes.toString().padStart(2, "0");
    const fechaStringNueva: string = `${diaFormateado}-${mesFormateado}-${anio}`;
  
    return fechaStringNueva;
  }
}

