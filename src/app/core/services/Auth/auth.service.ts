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
  private warningTimeoutId: any;
  private logoutTimeoutId: any;


  readonly dialog = inject(MatDialog);

  constructor(
    private http: HttpClient,
    private router: Router,
    private httpConnection: HttpConnectionService
  ) { }


  login(credentials: { username: string; password: string }): Observable<any> {
    const url = `${this.httpConnection.getBaseUrl()}${this.endpoint}`;
    return this.http.post<any>(url, credentials).pipe(
      tap(response => {
        if (response.token) {
          // Guardar token
          sessionStorage.setItem('token', response.token);
          // Guardar usuario decodificado
          const decoded = this.decodeToken(response.token);
          sessionStorage.setItem('usuario', JSON.stringify(decoded));

          // Guardar nombre si viene en la respuesta
          if (response.nombre) {
            sessionStorage.setItem('nombre', response.nombre);
          }
          // Guardar refreshToken
          sessionStorage.setItem('refreshToken', response.refreshToken)
        }
      }),
      catchError(error => {
        console.error('Error en login:', error);
        if (error.status === 0) {
          return throwError(() => new Error('Servicio no disponible por el momento'));
        } else {
          return throwError(() => new Error('Contraseña o usuario incorrecto'));
        }
      })
    );
  }

  logout(): void {
    this.dialog.closeAll();
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('nombre');

    if (this.warningTimeoutId) {
      clearTimeout(this.warningTimeoutId);
      this.warningTimeoutId = null;
    }
    if (this.logoutTimeoutId) {
      clearTimeout(this.logoutTimeoutId);
      this.logoutTimeoutId = null;
    }
    this.router.navigate(['/']);
  }


  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  getUsuario(): any {
    const userData = sessionStorage.getItem('usuario');
    return userData ? JSON.parse(userData) : null;
  }

  getNombre(): string | null {
    return sessionStorage.getItem('nombre');
  }

  checkTokenExpiration(): void {
    console.log('Verificando expiración del token...');

    const token = this.getToken();
    if (!token) {
      this.router.navigate(['/404']);
      return;
    }

    // Cancelar timers anteriores antes de crear nuevos
    if (this.warningTimeoutId) {
      clearTimeout(this.warningTimeoutId);
      this.warningTimeoutId = null;
    }
    if (this.logoutTimeoutId) {
      clearTimeout(this.logoutTimeoutId);
      this.logoutTimeoutId = null;
    }

    const decoded = this.decodeToken(token);
    const expiration = decoded.exp * 1000;
    const now = Date.now();

    if (expiration < now) {
      this.logout();
    } else {
      const timeLeft = expiration - now;
      // Mostrar advertencia al 10% del tiempo de expiración
      const warningTime = timeLeft * 0.1;
      const minutesLeft = (timeLeft / 60000).toFixed(2);
      console.log(`Tiempo restante para expiración del token: ${minutesLeft} min (${timeLeft} ms) la sesion caduca a las ${new Date(expiration).toLocaleTimeString()}`);

      //Programar aviso antes de expirar
      if (timeLeft > warningTime) {
        this.warningTimeoutId = setTimeout(
          () => this.showExpirationWarning(),
          timeLeft - warningTime
        );
      }
      // this.warningTimeoutId = setTimeout(() => this.showExpirationWarning(), timeLeft - this.warningTime);
      this.logoutTimeoutId = setTimeout(() => this.logout(), timeLeft);
    }
  }

  showExpirationWarning(): void {
    this.dialog.open(InformativeDialogComponent, {
      disableClose: true,
      data: { message: 'Tu sesión está por expirar. Guarda tu trabajo o inicia sesión de nuevo.' }
    });
  }

  decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error('Error al decodificar token:', error);
      return {};
    }
  }


  tienePermiso(modulo: string, accion: string): boolean {
    const usuario = this.getUsuario();
    return usuario?.permisos?.[modulo]?.includes(accion) || false;
  }

  refreshToken(refreshToken: string) {
    console.log('Refrescando token con refreshToken:', refreshToken);
    return this.http.post('http://localhost:8080/auth/refresh', { headers: this.httpConnection.getDefaultHeaders(), refreshToken: refreshToken });
  }

}
