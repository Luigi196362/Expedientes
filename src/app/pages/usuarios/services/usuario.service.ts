import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpConnectionService } from '../../../core/services/Http/http-connection.service';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private endpoint = '/api/usuarios';

  constructor(
    private http: HttpClient,
    private httpConnection: HttpConnectionService
  ) { }

  // Obtener todos los usuarios
  getUsuarios(): Observable<Usuario[]> {
    const url = `${this.httpConnection.getBaseUrl()}${this.endpoint}/ver`;
    return this.http.get<Usuario[]>(url, { headers: this.httpConnection.getDefaultHeaders() });
  }

  // Guardar un usuario
  guardarUsuario(usuario: Usuario): Observable<Usuario> {
    const url = `${this.httpConnection.getBaseUrl()}${this.endpoint}/crear`;
    return this.http.post<Usuario>(url, usuario, { headers: this.httpConnection.getDefaultHeaders() });
  }

  // Obtener un usuario por ID
  obtenerUsuarioPorId(id: number): Observable<Usuario> {
    const url = `${this.httpConnection.getBaseUrl()}${this.endpoint}/ver/${id}`;
    return this.http.get<Usuario>(url, { headers: this.httpConnection.getDefaultHeaders() });
  }

  // Actualizar un usuario por ID
  actualizarUsuario(id: number, usuario: Usuario): Observable<Usuario> {
    const url = `${this.httpConnection.getBaseUrl()}${this.endpoint}/editar/${id}`;
    return this.http.put<Usuario>(url, usuario, { headers: this.httpConnection.getDefaultHeaders() });
  }

  // Eliminar un usuario por ID
  eliminarUsuario(id: number): Observable<string> {
    const url = `${this.httpConnection.getBaseUrl()}${this.endpoint}/eliminar/${id}`;
    return this.http.delete<string>(url, { headers: this.httpConnection.getDefaultHeaders() });
  }
}
