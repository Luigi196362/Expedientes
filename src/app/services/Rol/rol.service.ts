import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpConnectionService } from '../Http/http-connection.service';
import { Rol } from '../../models/Rol';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  private endpoint = '/rol';

  constructor(
    private http: HttpClient,
    private httpConnection: HttpConnectionService
  ) {}

  // Obtener todos los roles
  getRoles(): Observable<Rol[]> {
    const url = `${this.httpConnection.getBaseUrl()}${this.endpoint}`;
    return this.http.get<Rol[]>(url, { headers: this.httpConnection.getDefaultHeaders() });
  }
/*
  // Guardar un paciente
  guardarPaciente(paciente: Paciente): Observable<Paciente> {
    const url = `${this.httpConnection.getBaseUrl()}${this.endpoint}`;
    return this.http.post<Paciente>(url, paciente, { headers: this.httpConnection.getDefaultHeaders() });
  }

  // Obtener un paciente por ID
  obtenerPacientePorId(id: number): Observable<Paciente> {
    const url = `${this.httpConnection.getBaseUrl()}${this.endpoint}/${id}`;
    return this.http.get<Paciente>(url, { headers: this.httpConnection.getDefaultHeaders() });
  }

  // Actualizar un paciente por ID
  actualizarPaciente(id: number, paciente: Paciente): Observable<Paciente> {
    const url = `${this.httpConnection.getBaseUrl()}${this.endpoint}/${id}`;
    return this.http.put<Paciente>(url, paciente, { headers: this.httpConnection.getDefaultHeaders() });
  }

  // Eliminar un paciente por ID
  eliminarPaciente(id: number): Observable<string> {
    const url = `${this.httpConnection.getBaseUrl()}${this.endpoint}/${id}`;
    return this.http.delete<string>(url, { headers: this.httpConnection.getDefaultHeaders() });
  }*/
}
