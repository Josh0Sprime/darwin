import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RutService {

  constructor() { }

  public validarRun = (run: string): boolean => {
    let runValido: boolean = false;

    if (/^(\d{1,3}(\.?\d{3})*)\-?([\dkK])$/.test(run)) {
      let runLimpio = run.replace(/\./g, '').replace('-', '');
      let digitoVerificador = runLimpio.charAt(runLimpio.length - 1);
      let runSinDigito = parseInt(runLimpio.substring(0, runLimpio.length - 1));

      let factor = 2;
      let suma = 0;
      for (let i = runSinDigito.toString().length - 1; i >= 0; i--) {
        factor = factor > 7 ? 2 : factor;
        suma += parseInt(runSinDigito.toString().charAt(i)) * factor;
        factor++;
      }
      let digitoCalculado = 11 - (suma % 11);

      runValido = (digitoCalculado === 11 && digitoVerificador === '0') ||
        (digitoCalculado === 10 && digitoVerificador === 'K') ||
        (digitoCalculado === parseInt(digitoVerificador));
    }
    return runValido;
  }

  public formatearRUN = (run: string): string => {
    if (run.includes('-')) {
      run = run.replace(/-+/g, '');
    }

    const largoRun = run.length;
    const penultimo = run.charAt(largoRun - 2);
    const ultimo = run.charAt(largoRun - 1);
    if (largoRun > 1) {
      const nuevoRun = run.slice(0, largoRun - 2) + penultimo + '-' + ultimo;
      run = nuevoRun;
    }
    return run;
  }
}
