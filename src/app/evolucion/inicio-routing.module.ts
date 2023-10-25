import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { ListarComponent } from './pages/pacientes/pages/listar/listar.component';
import { MantenedorComponent } from './pages/medicos/mantenedor/mantenedor.component';
import { VerEvolucionesComponent } from './pages/pacientes/pages/ver-evoluciones/ver-evoluciones.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { Paso1Component } from './pages/pacientes/pages/components/paso1/paso1.component';
import { Paso2Component } from './pages/pacientes/pages/components/paso2/paso2.component';
import { Paso3Component } from './pages/pacientes/pages/components/paso3/paso3.component';
import { Paso5Component } from './pages/pacientes/pages/components/paso5/paso5.component';
import { AgregarEvolucionComponent } from './pages/pacientes/pages/agregar-evolucion/agregar-evolucion.component';
import { Paso4Component } from './pages/pacientes/pages/components/paso4/paso4.component';

const routes: Routes = [
  {
    path: '',
    component: NavbarComponent,
    children: [
      {
        path: 'pacientes',
        component: ListarComponent
      },
      {
        path: 'medicos',
        component: MantenedorComponent
      },
      {
        path: 'pacientes/evoluciones/:id',
        component: VerEvolucionesComponent
      },
      {
        path: 'pacientes/agregarEvolucion',
        component: AgregarEvolucionComponent,
        children: [
          {
            path: 'paso1/:id',
            component: Paso1Component
          },
          {
            path: 'paso2/:id',
            component: Paso2Component
          },
          {
            path: 'paso3/:id',
            component: Paso3Component
          },
          {
            path: 'paso4/:id',
            component: Paso4Component
          },
          {
            path: 'paso5/:id',
            component: Paso5Component
          }
        ]
      },
      {
        path: '**',
        component: InicioComponent
      },
      {
        path: '**',
        redirectTo: 'inicio'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InicioRoutingModule { }
