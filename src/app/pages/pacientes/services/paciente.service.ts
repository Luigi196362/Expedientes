import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpConnectionService } from '../../../core/services/Http/http-connection.service';
import { Paciente } from '../models/paciente.model';

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
  getPacientes(): Observable<Paciente[]> {
    const url = `${this.httpConnection.getBaseUrl()}${this.endpoint}/ver`;
    return this.http.get<Paciente[]>(url, { headers: this.httpConnection.getDefaultHeaders() });
  }

  // Guardar un paciente
  guardarPaciente(paciente: Paciente): Observable<Paciente> {
    const url = `${this.httpConnection.getBaseUrl()}${this.endpoint}/crear`;
    return this.http.post<Paciente>(url, paciente, { headers: this.httpConnection.getDefaultHeaders() });
  }

  // Obtener un paciente por ID
  obtenerPacientePorId(id: number): Observable<Paciente> {
    const url = `${this.httpConnection.getBaseUrl()}${this.endpoint}/ver/${id}`;
    return this.http.get<Paciente>(url, { headers: this.httpConnection.getDefaultHeaders() });
  }

  // Actualizar un paciente por ID
  actualizarPaciente(id: number, paciente: Paciente): Observable<Paciente> {
    const url = `${this.httpConnection.getBaseUrl()}${this.endpoint}/editar/${id}`;
    return this.http.put<Paciente>(url, paciente, { headers: this.httpConnection.getDefaultHeaders() });
  }

  // Eliminar un paciente por ID
  eliminarPaciente(id: number): Observable<string> {
    const url = `${this.httpConnection.getBaseUrl()}${this.endpoint}/eliminar/${id}`;
    return this.http.delete<string>(url, { headers: this.httpConnection.getDefaultHeaders() });
  }
}
