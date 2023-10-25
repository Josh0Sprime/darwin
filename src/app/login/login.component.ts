import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './services/login.service';
import { RutService } from '../evolucion/services/rut.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [
    FormBuilder
  ]
})
export class LoginComponent {

  loginForm: FormGroup = this.fb.group({
    usuario: ['', Validators.required],
    password: ['', Validators.required]
  })

  constructor(private router: Router, private fb: FormBuilder, private sv: LoginService, private runService: RutService){

  }
  
  errorLogin: boolean = false;
  errorCampoUsuario: boolean = false;
  errorCampoPassword: boolean = false;

  login(){
    if(this.loginForm.valid){
      const { usuario, password } = this.loginForm.value;
      this.router.navigateByUrl('inicio')
      // this.sv.login( usuario, password ).subscribe(resp => {
      //   if(resp.ok){
      //     this.sv.setRolUsuario = resp.rol;
      //     const primerNombre = resp.nombre.split(' ', 1).toString();
      //     const inicialApellidoPaterno = resp.apellidos.split(' ', 1).toString().substring(0,1).toUpperCase();
      //     const nombreMayus = primerNombre.charAt(0).toUpperCase();
      //   this.sv.usuario = `${nombreMayus}${primerNombre.substring(1)} ${inicialApellidoPaterno}.`;
      //   this.sv.id_usuario = resp.id_usuario;
      //   }else{
      //     this.errorLogin = true;
      //     this.errorCampoPassword = false;
      //     this.errorCampoUsuario = false;
      //   }
      // })
      
    }else{
      if(this.loginForm.value["password"] === ''){
        this.errorCampoPassword = true;
      }
      if(this.loginForm.value["usuario"] === ''){
        this.errorCampoUsuario = true;
      }
    }
  }

  public formatearRun(){
    let run: string = this.loginForm.get('usuario')?.value;
    run = this.runService.formatearRUN(run);
    this.loginForm.controls['usuario'].setValue(run);
  }
  
}
