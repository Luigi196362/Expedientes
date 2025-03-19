import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpConnectionService } from '../../../../core/services/Http/http-connection.service';
import { Nota_Evolucion } from '../../models/nota-evolucion';
import { Registro } from '../../models/Registro';
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

  getNotas(): Observable<Registro[]> {
    const url = `${this.httpConnection.getBaseUrl()}${this.endpoint}/ver`;
    return this.http.get<Registro[]>(url, { headers: this.httpConnection.getDefaultHeaders() });
  }

  guardarNota(nombreUsuario: String, idPaciente: number, notas_evolucion: Nota_Evolucion): Observable<Nota_Evolucion> {
    const url = `${this.httpConnection.getBaseUrl()}${this.endpoint}/crear/nota/${nombreUsuario}/${idPaciente}`;
    return this.http.post<Nota_Evolucion>(url, notas_evolucion, { headers: this.httpConnection.getDefaultHeaders() });
  }

  guardarHistoria(nombreUsuario: String, idPaciente: number, historia_clinica: Historia_clinica): Observable<Historia_clinica> {
    const url = `${this.httpConnection.getBaseUrl()}${this.endpoint}/crear/historia/${nombreUsuario}/${idPaciente}`;
    return this.http.post<Historia_clinica>(url, historia_clinica, { headers: this.httpConnection.getDefaultHeaders() });
  }

  // Exportar registros a PDF
  exportar(): Observable<Blob> {
    const url = `${this.httpConnection.getBaseUrl()}${this.endpoint}/exportar`;
    return this.http.get(url, { headers: this.httpConnection.getDefaultHeaders(), responseType: 'blob' });
  }
}