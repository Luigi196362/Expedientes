import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/Auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class PermissionGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    /**
     * Se espera que en la data de la ruta se envíe:
     * data: { modulo: 'usuarios', accion: 'Crear' }
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const modulo = route.data['modulo'];
        const accion = route.data['accion'];

        if (this.authService.tienePermiso(modulo, accion)) {
            return true;
        } else {
            // Puedes redirigir a una página de "no autorizado"
            this.router.navigate(['/404']);
            return false;
        }
    }
}
