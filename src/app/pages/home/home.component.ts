import { Component } from '@angular/core';
import { AuthService } from '../../core/services/Auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  usuario = {
    nombre: 'Usuario',
    rol: 'Administrador' // Aquí se puede asignar dinámicamente el rol del usuario autenticado
  };

  constructor(private authService: AuthService) {
    // Suponiendo que authService tiene un método para obtener la información del usuario actual
    const userData = this.authService.getUsuario();
    if (userData) {
      this.usuario.nombre = userData.sub;
      this.usuario.rol = userData.rol;
    }
  }

  getSaludo(): string {
    const hora = new Date().getHours();
    if (hora < 12) return 'Buenos días';
    if (hora < 18) return 'Buenas tardes';
    return 'Buenas noches';
  }
}