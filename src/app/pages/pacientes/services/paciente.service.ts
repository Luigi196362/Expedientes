import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpConnectionService } from '../../../core/services/Http/http-connection.service';
import { Paciente } from '../models/paciente.model';
import { AllPacientes } from '../models/allPacientes.model';
import { EstadisticasPaciente } from '../models/estadisticas-paciente';

@Injectable({
  providedIn: 'root',
})
export class PacienteService {
  private endpoint = '/api/pacientes';

  constructor(
    private http: HttpClient,
    private httpConnection: HttpConnectionService
  ) { }

  // Obtener todos los pacientes
  getPacientes(): Observable<AllPacientes> {
    const url = `${this.httpConnection.getBaseUrl()}${this.endpoint}/Ver`;
    return this.http.get<AllPacientes>(url, { headers: this.httpConnection.getDefaultHeaders() });
  }

  // Guardar un paciente
  guardarPaciente(paciente: Paciente): Observable<Paciente> {
    const url = `${this.httpConnection.getBaseUrl()}${this.endpoint}/Crear`;
    return this.http.post<Paciente>(url, paciente, { headers: this.httpConnection.getDefaultHeaders() });
  }

  // Obtener un paciente por ID
  obtenerPacientePorId(id: number): Observable<Paciente> {
    const url = `${this.httpConnection.getBaseUrl()}${this.endpoint}/Ver/${id}`;
    return this.http.get<Paciente>(url, { headers: this.httpConnection.getDefaultHeaders() });
  }

  // Actualizar un paciente por ID
  actualizarPaciente(id: number, paciente: Paciente): Observable<Paciente> {
    const url = `${this.httpConnection.getBaseUrl()}${this.endpoint}/Editar/${id}`;
    return this.http.put<Paciente>(url, paciente, { headers: this.httpConnection.getDefaultHeaders() });
  }

  // Eliminar un paciente por ID
  eliminarPaciente(id: number): Observable<string> {
    const url = `${this.httpConnection.getBaseUrl()}${this.endpoint}/Eliminar/${id}`;
    return this.http.delete<string>(url, { headers: this.httpConnection.getDefaultHeaders() });
  }

  // Obtener estadísticas de pacientes
  estadisticasPaciente(): Observable<EstadisticasPaciente> {
    const url = `${this.httpConnection.getBaseUrl()}${this.endpoint}/Estadisticas`;
    return this.http.get<EstadisticasPaciente>(url, { headers: this.httpConnection.getDefaultHeaders() });
  }

  // Obtener estadísticas de pacientes por rango de fechas
  estadisticasRango(startDate: string, endDate: string): Observable<EstadisticasPaciente> {
    const url = `${this.httpConnection.getBaseUrl()}${this.endpoint}/Estadisticas/Rango?startDate=${startDate}&endDate=${endDate}`;
    return this.http.get<EstadisticasPaciente>(url, { headers: this.httpConnection.getDefaultHeaders() });
  }

  // Obtener reporte PDF
  obtenerReportePdf(startDate?: string, endDate?: string): Observable<HttpResponse<Blob>> {
    let url = `${this.httpConnection.getBaseUrl()}${this.endpoint}/Estadisticas/Pdf`;
    const params: string[] = [];
    if (startDate) params.push(`startDate=${startDate}`);
    if (endDate) params.push(`endDate=${endDate}`);

    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    return this.http.get(url, {
      headers: this.httpConnection.getDefaultHeaders(),
      responseType: 'blob',
      observe: 'response'
    });
  }

}
