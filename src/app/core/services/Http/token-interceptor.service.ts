// src/app/core/services/Http/token-interceptor.service.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = sessionStorage.getItem('token');
        //console.log('Interceptor ejecutado');
        if (token) {
            //  console.log('Token encontrado:', token);
            const clonedRequest = req.clone({
                headers: req.headers.set('Authorization', 'Bearer ' + token)
            });
            //console.log('Solicitud modificada:', clonedRequest);
            return next.handle(clonedRequest);
        }
        //console.log('No hay token disponible');
        return next.handle(req);
    }

}
