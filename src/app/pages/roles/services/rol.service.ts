import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpConnectionService } from '../../../core/services/Http/http-connection.service';
import { Rol } from '../models/rol.model';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  private endpoint = '/api/roles';

  constructor(
    private http: HttpClient,
    private httpConnection: HttpConnectionService
  ) { }

  getRoles(): Observable<Rol[]> {
    const url = `${this.httpConnection.getBaseUrl()}${this.endpoint}/Ver`;
    return this.http.get<Rol[]>(url, { headers: this.httpConnection.getDefaultHeaders() });
  }

  getRolesNombres(): Observable<Rol[]> {
    const url = `${this.httpConnection.getBaseUrl()}${this.endpoint}/Ver/Nombres`;
    return this.http.get<Rol[]>(url, { headers: this.httpConnection.getDefaultHeaders() });
  }

  guardarRol(rol: Rol): Observable<Rol> {
    const url = `${this.httpConnection.getBaseUrl()}${this.endpoint}/Crear`;
    return this.http.post<Rol>(url, rol, { headers: this.httpConnection.getDefaultHeaders() });
  }

  obtenerRolPorId(id: number): Observable<Rol> {
    const url = `${this.httpConnection.getBaseUrl()}${this.endpoint}/Ver/${id}`;
    return this.http.get<Rol>(url, { headers: this.httpConnection.getDefaultHeaders() });
  }

  // Actualizar un rol por ID
  actualizarRol(id: number, rol: Rol): Observable<Rol> {
    const url = `${this.httpConnection.getBaseUrl()}${this.endpoint}/Editar/${id}`;
    return this.http.put<Rol>(url, rol, { headers: this.httpConnection.getDefaultHeaders() });
  }

  // // Eliminar un paciente por ID
  // eliminarPaciente(id: number): Observable<string> {
  //   const url = `${this.httpConnection.getBaseUrl()}${this.endpoint}/${id}`;
  //   return this.http.delete<string>(url, { headers: this.httpConnection.getDefaultHeaders() });
  // }
}
