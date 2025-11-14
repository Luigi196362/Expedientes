import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, switchMap, catchError, finalize } from 'rxjs';
import { AuthService } from '../../services/Auth/auth.service';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {


    private isRefreshing = false;

    constructor(private authService: AuthService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const token = sessionStorage.getItem('token');
        const RefreshToken = sessionStorage.getItem('refreshToken');

        if (req.url.includes('/auth/refresh')) {
            const cloned = token
                ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
                : req;
            return next.handle(cloned);
        }


        if (RefreshToken && !this.isRefreshing) {
            this.isRefreshing = true;
            return this.authService.refreshToken().pipe(
                switchMap(success => {
                    if (success) {
                        console.log('Token renovado desde el interceptor');
                        const newToken = sessionStorage.getItem('token') || token;
                        const cloned = req.clone({
                            setHeaders: { Authorization: `Bearer ${newToken}` }
                        });
                        return next.handle(cloned);
                    } else {
                        console.log('⚠️ No se pudo renovar el token desde el interceptor');
                        const clonedRequest = token
                            ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
                            : req;
                        return next.handle(clonedRequest);
                    }
                }),
                catchError(err => {
                    console.error('Error en el interceptor:', err);

                    const clonedRequest = token
                        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
                        : req;
                    return next.handle(clonedRequest);
                }),
                finalize(() => {
                    this.isRefreshing = false;
                }
                )
            );
        }

        const clonedRequest = token
            ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
            : req;
        return next.handle(clonedRequest);
    }
}
