import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { LoginGuard } from './guards/login.guard';

const routes: Routes = [
  {
    path:'inicio',
    loadChildren: () => import('./evolucion/inicio.module').then(m => m.InicioModule),
    canActivate: [LoginGuard],
    canLoad: [LoginGuard]
  },
  {
    path: '',
    component: LoginComponent
  },
  {
    path: '**',
    redirectTo: "inicio"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
