import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment.prod'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of, map } from 'rxjs';
import { Paciente } from '../pages/pacientes/interfaces/paciente.interface';
import { Respuesta, RespuestaAgregarPaciente, RespuestaEvolucionPaciente, RespuestaObtenerIdPaciente } from '../pages/pacientes/interfaces/respuesta.interface';
import { Fonasa } from '../pages/pacientes/interfaces/fonasa';
import { RespuestaUsuario } from 'src/app/login/interfaces/login.interface';
import { Medico, EstadoMedico, DatosMedico } from '../pages/medicos/interfaces/medicos';
import { Evolucion } from '../pages/pacientes/interfaces/evaluacion.interface';
import { adicionalPaciente } from '../pages/pacientes/interfaces/adicionalPaciente.interface';
import { Servicio } from '../pages/pacientes/interfaces/servicio.interface';
import { RespuestaEvolucion } from '../pages/pacientes/interfaces/evolucion';
import { EstadoEpisodioPaciente } from '../pages/pacientes/interfaces/respuestaEstadoPaciente.interface';
import { RespuestaRol } from '../pages/medicos/interfaces/respuestaRol.interface';


@Injectable({
  providedIn: 'root'
})
export class EvolucionService {

  private url: string = environment.baseUrl;
  public _dataEvolucion = [
    {
      fecha_registro: '',
      id_paciente: 0,
      id_medico: 0,
      id_servicio: 0,
      diagnostico: '',
      estudio_complementario: '',
      evolucion: '',
      plan: '',
      fecha_alta: '',
      nombre_interno: '',
      participacion_interno: false,
    }
  ];

  private _id_paciente: number = 0;

  set setIdPaciente(id: any) {
    this._id_paciente = id;
  }

  get getIdPaciente() {
    return this._id_paciente;
  }

  private urlTest: string = "https://pacientes.hospitaldeovalle.cl";

  constructor(private http: HttpClient) { }

  ObtenerPacienteAPI = (run: string): Observable<any> => {
    const auth = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Basic " + btoa("darwin:EPBzMzh2Ad32t3KXykRGng2jWGeryekT"),
    });

    const url = `${this.urlTest}/pacientes/buscar/${run}`;

    return this.http.post<any>(url, null, { headers: auth });
  }

  ListadoTodosLosPacientes(): Observable<any> {
    const url = `${this.url}/paciente/listadoPacientes`;
    const headers = new HttpHeaders().set('token', localStorage.getItem('token')!);
    return this.http.get<any>(url, { headers });
  }

  BuscarPersona_brazaleteBD(run: string) {
    const url = `${this.url}/paciente/buscarPersonaBrazalete`;
    const token = localStorage.getItem('token');

    const body = {
      run,
      token
    };
    return this.http.post(url, body);
  }

  obtenerIdPacientePorEvolucion(id_evolucion: number): Observable<RespuestaObtenerIdPaciente> {
    const url = `${this.url}/paciente/obtenerIdPacienteEvolucion`;
    const token = localStorage.getItem('token');
    const payload = { id_evolucion, token };

    return this.http.post<RespuestaObtenerIdPaciente>(url, payload);
  }

  validarEvolucion(idPaciente: number): Observable<Respuesta> {
    const url = `${this.url}/evolucion/verificarEvolucion`;
    const token = localStorage.getItem('token');
    const payload = { idPaciente, token };

    return this.http.post<Respuesta>(url, payload);
  }

  verificarPersona(run: string): Observable<Paciente[]> {
    const url = `${this.url}/paciente/verificarPaciente`;
    const token = localStorage.getItem('token');

    const body = {
      run,
      token
    };
    return this.http.post<Paciente[]>(url, body);
  }

  obenerInformacionDelPaciente(idPaciente: number): Observable<Paciente[]> {
    const url = `${this.url}/paciente/informacionPaciente`;
    const token = localStorage.getItem('token');

    const body = { idPaciente, token };

    return this.http.post<Paciente[]>(url, body);
  }

  obenerInformacionAdicionalPaciente(idPaciente: number): Observable<adicionalPaciente[]> {
    const url = `${this.url}/paciente/informacionAdicionalPaciente`;
    const token = localStorage.getItem('token');

    const body = { idPaciente, token };

    return this.http.post<adicionalPaciente[]>(url, body);
  }


  obtenerEvolucionesPaciente(idPaciente: number): Observable<Evolucion[]> {
    const url = `${this.url}/evolucion/EvolucionPaciente`;
    const token = localStorage.getItem('token');

    const body = { idPaciente, token };

    return this.http.post<Evolucion[]>(url, body);
  }

  obtenerDetalleDeEvolucion(idEvolucion: number): Observable<Evolucion[]> {
    const url = `${this.url}/evolucion/DetalleEvolucion`;
    const token = localStorage.getItem('token');

    const body = { idEvolucion, token };

    return this.http.post<Evolucion[]>(url, body);
  }

  obtenerTodosLosServicios(): Observable<Servicio[]> {
    const url = `${this.url}/evolucion/ListadoServicios`;
    const headers = new HttpHeaders().set('token', localStorage.getItem('token')!);

    return this.http.get<Servicio[]>(url, { headers });
  }

  AgregarPaciente(
    run: string,
    nombres: string,
    apellidos: string,
    fecha_nacimiento: string,
    genero: string,
    fecha_ingreso: string): Observable<RespuestaAgregarPaciente> {

    const url = `${this.url}/paciente/registrarPaciente`;
    const token = localStorage.getItem('token');

    const body = { run, nombres, apellidos, fecha_nacimiento, genero, fecha_ingreso, token };
    return this.http.post<RespuestaAgregarPaciente>(url, body);
  }

  DarDeAlta(idPaciente: number): Observable<Respuesta> {

    const url = `${this.url}/paciente/altaPaciente`;
    const token = localStorage.getItem('token');
    const body = { idPaciente, token };
    return this.http.post<Respuesta>(url, body);
  }

  ObtenerEpisodiosPaciente(idPaciente: number): Observable<any> {

    const url = `${this.url}/evolucion/EpisodiosPaciente`;
    const token = localStorage.getItem('token');
    const body = { idPaciente, token };
    return this.http.post<any>(url, body);
  }


  obtenerPacienteFonasa = (run: string): Observable<Fonasa> => {
    let separador = run.split("-");
    const token = localStorage.getItem('token');

    const body = {
      run: separador[0],
      dverificador: separador[1],
      token
    };
    return this.http.post<Fonasa>(`${this.url}/paciente/buscarFonasa`, body);
  }

  crearUsuario(
    password: string,
    run: string,
    nombres: string,
    apellidos: string,
    rol: number): Observable<RespuestaUsuario> {

    const urlCrearUsuario = `${this.url}/medico/crearMedico`;
    const token = localStorage.getItem('token');

    const payload = {
      password,
      run,
      nombres,
      apellidos,
      rol,
      token
    };

    return this.http.post<RespuestaUsuario>(urlCrearUsuario, payload);
  }

  obtenerMedicos(): Observable<Medico[]> {
    const url = `${this.url}/medico/obtener`;
    const headers = new HttpHeaders().set('token', localStorage.getItem('token')!);
    return this.http.get<Medico[]>(url, { headers });
  }

  obtenerEstadoMedico(run: number): Observable<EstadoMedico[]> {
    const url = `${this.url}/medico/obtenerEstado`;
    const token = localStorage.getItem('token');
    const payload = {
      run,
      token
    };

    return this.http.post<EstadoMedico[]>(url, payload);
  }

  cambiarEstadoMedico(id_estado: number, run: number) {
    const url = `${this.url}/medico/cambiarEstado`;
    const token = localStorage.getItem('token');
    const payload = {
      id_estado,
      run,
      token
    };

    return this.http.post(url, payload);
  }

  obtenerDatosMedicos(id_medico: number): Observable<DatosMedico[]> {
    const url = `${this.url}/medico/obtenerDatosMedico`;
    const token = localStorage.getItem('token');
    const payload = {
      id_medico,
      token
    };

    return this.http.post<DatosMedico[]>(url, payload);

  }

  obtenerDatosServicio(idServicio: number): Observable<any[]> {
    const url = `${this.url}/evolucion/NombreServicio`;
    const token = localStorage.getItem('token');
    const payload = {
      idServicio,
      token
    };

    return this.http.post<any[]>(url, payload);

  }

  modificarMedico(
    nombres: string,
    apellidos: string,
    id_medico: number,
    id_estado: number,
    run_usuario: number,
    id_rol: number) {

    const url = `${this.url}/medico/modificarMedico`;
    const token = localStorage.getItem('token');
    const payload = {
      nombres,
      apellidos,
      id_medico,
      id_estado,
      run_usuario,
      id_rol,
      token
    };

    return this.http.patch(url, payload);
  }

  obtenerEvolucionPaciente(idPaciente: number): Observable<RespuestaEvolucion[]> {
    const url = `${this.url}/evolucion/obtenerEvolucion`;
    const token = localStorage.getItem('token');
    const payload = {
      idPaciente,
      token
    };

    return this.http.post<RespuestaEvolucion[]>(url, payload);
  }

  obtenerEvolucionConfirmar(id_evolucion: number): Observable<RespuestaEvolucion[]> {
    const url = `${this.url}/evolucion/obtenerEvolucionConfirmar`;
    const token = localStorage.getItem('token');
    const payload = { token, id_evolucion };


    return this.http.post<RespuestaEvolucion[]>(url, payload);

  }

  agregarEvolucionPaciente() {
    const url = `${this.url}/evolucion/agregarEvolucion`;
    const { diagnostico, evolucion, fecha_alta, fecha_registro,
      id_medico, id_paciente, id_servicio, plan, estudio_complementario, nombre_interno, participacion_interno } = this._dataEvolucion[0];
    const token = localStorage.getItem('token');
    const payload = {
      diagnostico, evolucion, fecha_alta, fecha_registro,
      id_medico, id_paciente, id_servicio, plan, token,
      estudio_complementario, nombre_interno, participacion_interno
    };

    return this.http.post(url, payload);
  }

  agregarEvolucionPacienteEnProceso() {
    const url = `${this.url}/evolucion/agregarEvolucionProceso`;
    const { diagnostico, evolucion, fecha_alta, fecha_registro,
      id_medico, id_paciente, id_servicio, plan, estudio_complementario, nombre_interno, participacion_interno } = this._dataEvolucion[0];
    const token = localStorage.getItem('token');
    const payload = {
      diagnostico, evolucion, fecha_alta, fecha_registro,
      id_medico, id_paciente, id_servicio, plan, token,
      estudio_complementario, nombre_interno, participacion_interno
    };

    return this.http.post(url, payload);
  }

  obtenerAltasHoy = (): Observable<any> => {
    const url = `${this.url}/evolucion/altasHoy`;
    const token = localStorage.getItem('token');
    const payload = { token };

    return this.http.post<any>(url, payload);
  }

  obtenerAltas = (): Observable<any> => {
    const url = `${this.url}/evolucion/altas`;
    const token = localStorage.getItem('token');
    const payload = { token };

    return this.http.post<any>(url, payload);
  }

  obtenerPacientes = (): Observable<any> => {
    const url = `${this.url}/evolucion/pacientes`;
    const token = localStorage.getItem('token');
    const payload = { token };

    return this.http.post<any>(url, payload);
  }

  obtenerIdPaciente(run: string): Observable<any> {
    const url = `${this.url}/paciente/obtenerIdPaciente`;
    const token = localStorage.getItem('token');
    const payload = { run, token };

    return this.http.post(url, payload);
  }

  obtenerPacientesAlta(): Observable<any> {
    const url = `${this.url}/paciente/listadoPacientesAlta`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('token', token!);

    return this.http.get(url, { headers });
  }

  verificarEvolucionesPaciente(id_paciente: number): Observable<RespuestaEvolucionPaciente> {
    const url = `${this.url}/paciente/verificarEvoluciones`;
    const token = localStorage.getItem('token');
    const payload = { id_paciente, token }

    return this.http.post<RespuestaEvolucionPaciente>(url, payload);
  }

  obtenerEvolucionesHoy = (): Observable<any> => {
    const url = `${this.url}/evolucion/evolucionesHoy`;
    const token = localStorage.getItem('token');
    const payload = { token };

    return this.http.post<any>(url, payload);
  }

  obtenerListadoDeEvolucionesPorEpisodio = (Episodio: number): Observable<any> => {

    const url = `${this.url}/evolucion/EvolucionesEpisodio`;
    const token = localStorage.getItem('token');
    const payload = { Episodio, token };

    return this.http.post<any>(url, payload);
  }

  confirmarEvolucion(id_evolucion: number): Observable<Respuesta> {
    const url = `${this.url}/evolucion/confirmarEvolucion`;
    const { diagnostico, evolucion, fecha_alta, fecha_registro,
      id_medico, id_paciente, id_servicio, plan, estudio_complementario, nombre_interno } = this._dataEvolucion[0];
    const token = localStorage.getItem('token');
    const payload = {
      diagnostico, evolucion, fecha_alta, fecha_registro,
      id_medico, id_paciente, id_servicio, plan, token, estudio_complementario,
      id_evolucion, nombre_interno
    };
    return this.http.post<Respuesta>(url, payload);
  }
  //coment
  consultarEstadoEpisodio(idPaciente: number): Observable<EstadoEpisodioPaciente> {
    const url = `${this.url}/paciente/verificarEstadoEpisodio`;
    const token = localStorage.getItem('token');
    const payload = { token, idPaciente };

    return this.http.post<EstadoEpisodioPaciente>(url, payload);
  }

  obtenerTodosLosDetallesEvolucionPDF(id_evolucion: number): Observable<any> {

    const url = `${this.url}/evolucion/EvolucionPDF`;
    const token = localStorage.getItem('token');
    const body = { id_evolucion, token };
    return this.http.post<any>(url, body);
  }

  obtenerTodosLosDetallesEvolucionPDFActual(id_evolucion: number): Observable<any> {

    const url = `${this.url}/evolucion/EvolucionPDFActual`;
    const token = localStorage.getItem('token');
    const body = { id_evolucion, token };
    return this.http.post<any>(url, body);
  }


  obtenerAltasVencidas = (): Observable<any> => {
    const url = `${this.url}/evolucion/obtenerAltasVencidas`;
    const token = localStorage.getItem('token');
    const payload = { token };

    return this.http.post<Respuesta>(url, payload);
  }

  obtenerRoles(): Observable<RespuestaRol[]> {
    const url = `${this.url}/medico/obtenerRoles`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders().set('token', token!);

    return this.http.get<RespuestaRol[]>(url, { headers });
  }
}
