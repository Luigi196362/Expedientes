import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpConnectionService } from '../Http/http-connection.service';
import { MatDialog } from '@angular/material/dialog';
import { InformativeDialogComponent } from '../../../shared/informative-dialog/informative-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private endpoint = '/auth/login';
  private warningTime = 10 * 60 * 1000; // 10 minutos antes de la expiración
  private tokenKey = 'token';
  private userKey = 'usuario';

  readonly dialog = inject(MatDialog);

  constructor(
    private http: HttpClient,
    private router: Router,
    private httpConnection: HttpConnectionService
  ) { }

  /**
   * Inicia sesión y guarda los datos en sessionStorage.
   */
  login(credentials: { username: string; password: string }): Observable<any> {
    const url = `${this.httpConnection.getBaseUrl()}${this.endpoint}`;
    return this.http.post<any>(url, credentials).pipe(
      tap(response => {
        if (response.token) {
          sessionStorage.setItem(this.tokenKey, response.token);
          const decoded = this.decodeToken(response.token);
          sessionStorage.setItem(this.userKey, JSON.stringify(decoded));
        }
      }),
      catchError(error => {
        console.error('Error en login:', error);
        // Si el error no tiene status o es 0, es un error de conexión
        if (error.status === 0) {
          return throwError(() => new Error('Servicio no disponible por el momento'));
        } else {
          // Otros errores se consideran de autenticación
          return throwError(() => new Error('Contraseña o usuario incorrecto'));
        }
      })
    );
  }

  /**
   * Cierra sesión y limpia los datos almacenados.
   */
  logout(): void {
    this.dialog.closeAll();
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.userKey);
    this.router.navigate(['/']);
  }

  /**
   * Verifica si hay un token válido.
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Obtiene el token almacenado.
   */
  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  /**
   * Obtiene el usuario decodificado desde sessionStorage.
   */
  getUsuario(): any {
    const userData = sessionStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }


  /**
   * Verifica la expiración del token y programa alertas y logout automático.
   */
  checkTokenExpiration(): void {
    const token = this.getToken();
    if (!token) {
      this.router.navigate(['/404']);
      return;
    }

    const decoded = this.decodeToken(token);
    const expiration = decoded.exp * 1000;
    const now = Date.now();

    if (expiration < now) {
      this.logout();
    } else {
      const timeLeft = expiration - now;
      if (timeLeft > this.warningTime) {
        setTimeout(() => this.showExpirationWarning(), timeLeft - this.warningTime);
      }
      setTimeout(() => this.logout(), timeLeft);
    }
  }

  /**
   * Muestra una advertencia cuando la sesión está por expirar.
   */
  showExpirationWarning(): void {
    this.dialog.open(InformativeDialogComponent, {
      disableClose: true,
      data: { message: 'Tu sesión está por expirar. Guarda tu trabajo o inicia sesión de nuevo.' }
    });
  }

  /**
   * Decodifica un token JWT.
   */
  decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error('Error al decodificar token:', error);
      return {};
    }
  }

  /**
   * Verifica si el usuario tiene permiso para una acción específica.
   */
  tienePermiso(modulo: string, accion: string): boolean {
    const usuario = this.getUsuario();
    return usuario?.permisos?.[modulo]?.includes(accion) || false;
  }
}
