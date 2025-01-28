import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpConnectionService } from '../../../../core/services/Http/http-connection.service';
import { Nota_Evolucion } from '../../models/nota-evolucion';

@Injectable({
  providedIn: 'root'
})
export class NotasEvolucionService {
  private endpoint = '/NotaEvolucion';

  constructor(
    private http: HttpClient,
    private httpConnection: HttpConnectionService
  ) { }

  // Obtener todos los roles
  getNotas(): Observable<Nota_Evolucion[]> {
    const url = `${this.httpConnection.getBaseUrl()}${this.endpoint}`;
    return this.http.get<Nota_Evolucion[]>(url, { headers: this.httpConnection.getDefaultHeaders() });
  }

  // Guardar un usuario
  guardarUsuario(idUsuario: number, idPaciente: number, notas_evolucion: Nota_Evolucion): Observable<Nota_Evolucion> {
    const url = `${this.httpConnection.getBaseUrl()}${this.endpoint}/${idUsuario}/${idPaciente}`;
    return this.http.post<Nota_Evolucion>(url, notas_evolucion, { headers: this.httpConnection.getDefaultHeaders() });
  }
}