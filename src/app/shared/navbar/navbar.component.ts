import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../login/services/login.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  display: boolean = false;

  background: string = 'background-color: #EFF3F8 !important;'
  backgroundNav: string = 'background-color: #FFFFFF;'
  navMenuNocturno: string = 'width: 300px; text-align: center; padding: 10px; color: black;'
  abrirSidenav: boolean = true;
  sidebarNocturno: string = "background-color: #FFFFFF; color: #7777ff;";
  nocturno: any;

  get rolUsuario(){
    return this.sv.getRolUsuario;
  }

  constructor(private sv: LoginService, private router: Router, private fb: FormBuilder,
      private br: BreakpointObserver) {
        setInterval(() => {
          sv.validarTk().subscribe();
        }, 1000*30);
        this.mediaQuery();
      }


  mediaQuery() {
    this.br.observe(Breakpoints.XSmall).subscribe((state: BreakpointState) => {
        if(state.matches) {
          this.abrirSidenav = false
        } else {
          this.abrirSidenav = true;
        }
  })};

  get usuario(){
    return this.sv.usuario
  }

  ngOnInit(): void {
  }

  cerrarSesion(){
    this.sv.cerrarSesion();
    this.router.navigateByUrl('');
  }

  modOscuro(){
    if(this.nocturno === true){
      this.background = "background-color: #343434"
      this.backgroundNav = 'background-color: #202122; color: #FFFF;'
      this.navMenuNocturno = 'width: 300px; text-align: center; padding: 10px; color: #FFFF;'
      this.sidebarNocturno = "background-color: #202122; color: white;";
    }else{
      this.background = 'background-color: #EFF3F8 !important;'
      this.backgroundNav = 'background-color: #FFFFFF;'
      this.navMenuNocturno = 'width: 300px; text-align: center; padding: 10px; color: black;'
      this.sidebarNocturno = "background-color: #FFFFFF; color: #7777ff;";
    }
  }

}
