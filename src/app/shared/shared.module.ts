import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { PrimeModule } from '../prime/prime.module';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations" 
import { MaterialModule } from '../material/material.module';
import { RouterModule, RouterLinkActive } from '@angular/router';
import { InicioModule } from '../evolucion/inicio.module';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    NavbarComponent,
  ],
  imports: [
    CommonModule,
    PrimeModule,
    BrowserAnimationsModule,
    MaterialModule,
    RouterModule,
    InicioModule,
    RouterLinkActive,
    FormsModule
  ],
  exports: [
    NavbarComponent
  ],
})
export class SharedModule { }
