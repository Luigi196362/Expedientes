import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/Auth/auth.service';
import jwtDecode from 'jwt-decode';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate(): boolean {
        if (!this.authService.isAuthenticated()) {
            this.router.navigate(['/']);
            return false;
        }

        this.authService.checkTokenExpiration(); // Verificar la expiración en cada ruta protegida
        return true;
    }
}
