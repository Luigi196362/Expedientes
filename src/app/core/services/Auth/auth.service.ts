import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpConnectionService } from '../Http/http-connection.service';
import { MatDialog } from '@angular/material/dialog';
import { InformativeDialogComponent } from '../../../shared/informative-dialog/informative-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private endpoint = '/auth/login';
  private warningTime = 10 * 1000; // Tiempo antes de la expiración para mostrar la alerta (30 segundos)

  constructor(private http: HttpClient, private router: Router, private httpConnection: HttpConnectionService) { }

  login(credentials: { username: string; password: string }): Observable<any> {

    const url = `${this.httpConnection.getBaseUrl()}${this.endpoint}`;
    return this.http.post<any>(url, credentials);
  }

  logout(): void {
    this.dialog.closeAll();  // 🔴 Cierra todos los diálogos abiertos
    sessionStorage.removeItem('token');
    this.router.navigate(['/']); // Redirige a la página de login
  }

  isAuthenticated(): boolean {
    return sessionStorage.getItem('token') !== null;
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  checkTokenExpiration() {
    const token = this.getToken();
    if (!token) {
      this.router.navigate(['/']);
      return;
    }

    const decoded = this.decodeToken(token);
    const expiration = decoded.exp * 1000;
    const now = Date.now();

    if (expiration < now) {
      this.logout();
    } else {

      const timeLeft = expiration - now;

      // 🔔 Avisar antes de que expire
      if (timeLeft > this.warningTime) {
        setTimeout(() => this.showExpirationWarning(), timeLeft - this.warningTime);
      }
      setTimeout(() => this.logout(), timeLeft);  // Logout automático al expirar
    }
  }
  readonly dialog = inject(MatDialog);

  showExpirationWarning(): void {
    this.dialog.open(InformativeDialogComponent, {
      disableClose: true, // 🔴 Evita que se cierre al hacer clic fuera
      data: { message: 'Tu sesión está por expirar. Guarda tu trabajo o inicia sesión de nuevo.' }
    });
  }



  decodeToken(token: string): any {
    const payload = token.split('.')[1];  // El payload es la segunda parte del JWT
    return JSON.parse(atob(payload));    // Decodificamos el payload de base64
  }

}
