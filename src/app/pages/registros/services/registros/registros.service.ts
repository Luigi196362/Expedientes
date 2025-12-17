import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpConnectionService } from '../../../../core/services/Http/http-connection.service';
import { Nota_Evolucion } from '../../models/nota-evolucion';
import { Registro } from '../../models/registro';
import { Historia_clinica } from '../../models/historia-clinica';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {
  private endpoint = '/api/registros';

  constructor(
    private http: HttpClient,
    private httpConnection: HttpConnectionService
  ) { }

  getNota(idNota: number): Observable<Registro[]> {
    console.log(idNota);
    const url = `${this.httpConnection.getBaseUrl()}${this.endpoint}/Ver/Nota/${idNota}`;
    return this.http.get<Registro[]>(url, { headers: this.httpConnection.getDefaultHeaders() });
  }

  getHistoria(idHistoria: number): Observable<Registro[]> {
    console.log(idHistoria);
    const url = `${this.httpConnection.getBaseUrl()}${this.endpoint}/Ver/Historia/${idHistoria}`;
    return this.http.get<Registro[]>(url, { headers: this.httpConnection.getDefaultHeaders() });
  }

  guardarNota(idPaciente: number, notas_evolucion: Nota_Evolucion): Observable<Nota_Evolucion> {
    const url = `${this.httpConnection.getBaseUrl()}${this.endpoint}/Crear/Nota/${idPaciente}`;
    return this.http.post<Nota_Evolucion>(url, notas_evolucion, { headers: this.httpConnection.getDefaultHeaders() });
  }

  guardarHistoria(idPaciente: number, historia_clinica: Historia_clinica): Observable<Historia_clinica> {
    const url = `${this.httpConnection.getBaseUrl()}${this.endpoint}/Crear/Historia/${idPaciente}`;
    return this.http.post<Historia_clinica>(url, historia_clinica, { headers: this.httpConnection.getDefaultHeaders() });
  }

  // Obtener PDF de Nota de Evolución
  obtenerNotaPdf(idNota: number): Observable<HttpResponse<Blob>> {
    const url = `${this.httpConnection.getBaseUrl()}${this.endpoint}/Ver/Nota/${idNota}/Pdf`;
    return this.http.get(url, {
      headers: this.httpConnection.getDefaultHeaders(),
      responseType: 'blob',
      observe: 'response'
    });
  }

  // // Exportar registros a PDF
  // exportar(): Observable<Blob> {
  //   const url = `${this.httpConnection.getBaseUrl()}${this.endpoint}/Exportar`;
  //   return this.http.get(url, { headers: this.httpConnection.getDefaultHeaders(), responseType: 'blob' });
  // }
}