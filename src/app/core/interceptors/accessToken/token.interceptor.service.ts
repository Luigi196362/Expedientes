import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent
} from '@angular/common/http';
import { Observable, switchMap, catchError, throwError, finalize, tap, of } from 'rxjs';
import { AuthService } from '../../services/Auth/auth.service';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {

    private isRefreshing = false;

    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const refreshToken = sessionStorage.getItem('refreshToken');
        const token = sessionStorage.getItem('token');

        // Si hay refresh token, intentamos renovarlo antes de continuar
        if (refreshToken && !this.isRefreshing) {
            this.isRefreshing = true;

            return this.authService.refreshToken(refreshToken).pipe(
                tap((res: any) => {
                    // Solo si fue exitoso actualizamos tokens
                    if (res && res.token && res.refreshToken) {
                        sessionStorage.setItem('token', res.token);
                        sessionStorage.setItem('refreshToken', res.refreshToken);
                        this.authService.checkTokenExpiration();
                    }
                }),
                switchMap((res: any) => {
                    // Usamos el nuevo token si lo obtuvimos
                    const newToken = res?.token || token;
                    const cloned = req.clone({
                        setHeaders: { Authorization: `Bearer ${newToken}` }
                    });
                    return next.handle(cloned);
                }),
                catchError((err) => {
                    console.error('Error al refrescar token:', err);

                    // Si el refresh falla, seguimos con el token actual (sin renovar)
                    const clonedRequest = token
                        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
                        : req;

                    return next.handle(clonedRequest);
                }),
                finalize(() => {
                    this.isRefreshing = false;
                })
            );
        }

        // Si no hay refresh token, mandamos la petición normal
        const clonedRequest = token
            ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
            : req;

        return next.handle(clonedRequest);
    }
}
