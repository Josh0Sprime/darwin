import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, map, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { Login } from '../interfaces/login.interface';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private url: string = environment.baseUrl
  private _usuario!: string;
  private _id_usuario!: number;
  private rolUsuario!: number;

  get getRolUsuario(){
    return this.rolUsuario;
  }

  set setRolUsuario(rol: any){
    this.rolUsuario = rol;
  }

  get usuario (){
    return this._usuario;
  }

  get Getid_usuario(){
    return this._id_usuario;
  }

  set id_usuario(id: any){
    this._id_usuario = id;
  }

  set usuario(usuario: string){
    this._usuario = usuario;
  }

  constructor(private http: HttpClient) { }

  login( usuario: string, password: string ): Observable<Login>{
    const urlLogin = `${this.url}/login/validar`;
    const payload = {
      usuario,
      password
    };

    return this.http.post<Login>(urlLogin, payload)
    .pipe(
      tap(resp => {
        localStorage.setItem('token', resp.token);
      })
    )
  }

 

  validarTk(): Observable<boolean>{
      const url = `${this.url}/login/validarToken`;
      const headers = new HttpHeaders().append('token', localStorage.getItem('token')!);

      return this.http.get<Login>(url, {headers})
      .pipe(
        tap(resp => {
          localStorage.setItem('token', resp.token);
          const nombre = resp.nombre.toLowerCase();
          const primerNombre = nombre.split(' ', 1).toString();
          const inicialApellidoPaterno = resp.apellidos.split(' ', 1).toString().substring(0,1).toUpperCase();
          const nombreMayus = primerNombre.charAt(0).toUpperCase();
          this._usuario = `${nombreMayus}${primerNombre.substring(1)} ${inicialApellidoPaterno}.`;
          this.id_usuario = resp.id_usuario;
          this.setRolUsuario = resp.rol;
        }),
        map( resp => {
          return resp.ok
        }),
        catchError(resp =>  of(false))
      )
  }

  cerrarSesion(){
      localStorage.removeItem('token');
  }
}
