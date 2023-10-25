import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InicioRoutingModule } from './inicio-routing.module';
import { ListarComponent } from './pages/pacientes/pages/listar/listar.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { MantenedorComponent } from './pages/medicos/mantenedor/mantenedor.component';
import { PrimeModule } from '../prime/prime.module';
import { AgregarEvolucionComponent } from './pages/pacientes/pages/agregar-evolucion/agregar-evolucion.component';
import { AgregarPacienteComponent } from './pages/pacientes/pages/agregar-paciente/agregar-paciente.component';
import { ReactiveFormsModule } from '@angular/forms';
import { VerEvolucionesComponent } from './pages/pacientes/pages/ver-evoluciones/ver-evoluciones.component';
import { TablaComponent } from './pages/medicos/components/tabla/tabla.component';

import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { Paso1Component } from './pages/pacientes/pages/components/paso1/paso1.component';
import { Paso2Component } from './pages/pacientes/pages/components/paso2/paso2.component';
import { Paso3Component } from './pages/pacientes/pages/components/paso3/paso3.component';
import { Paso4Component } from './pages/pacientes/pages/components/paso4/paso4.component';
import { Paso5Component } from './pages/pacientes/pages/components/paso5/paso5.component';
import { TablaEvolucionesComponent } from './pages/pacientes/pages/ver-evoluciones/components/tabla-evoluciones/tabla-evoluciones.component';
import { TablaHistorialComponent } from './pages/pacientes/pages/ver-evoluciones/components/tabla-historial/tabla-historial.component';
import { HospitalizadosComponent } from './pages/pacientes/pages/listar/components/hospitalizados/hospitalizados.component';
import { AltaComponent } from './pages/pacientes/pages/listar/components/alta/alta.component';
@NgModule({
  declarations: [
    InicioComponent,
    ListarComponent,
    MantenedorComponent,
    AgregarEvolucionComponent,
    AgregarPacienteComponent,
    VerEvolucionesComponent,
    TablaComponent,
    Paso1Component,
    Paso2Component,
    Paso3Component,
    Paso4Component,
    Paso5Component,
    TablaEvolucionesComponent,
    TablaHistorialComponent,
    HospitalizadosComponent,
    AltaComponent,
  ],
  imports: [
    CommonModule,
    InicioRoutingModule,
    PrimeModule,
    ReactiveFormsModule,
    NgSelectModule,
    FormsModule
  ],
})
export class InicioModule { }
