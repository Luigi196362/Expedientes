import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/Auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class LoginGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate(): boolean {
        if (this.authService.isAuthenticated()) {
            // Si el usuario ya está autenticado, redirige a la página principal (o a la que consideres)
            this.router.navigate(['/layout/home']);
            return false;
        }
        return true;
    }
}
