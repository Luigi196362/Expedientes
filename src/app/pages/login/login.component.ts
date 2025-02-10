import { ChangeDetectionStrategy, Component, NgModule, signal, ChangeDetectorRef } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/Auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, RouterLink, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  loginData = { username: '', password: '' };
  errorMessage: string = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private cdr: ChangeDetectorRef // Añadir ChangeDetectorRef
  ) { }

  hide = signal(true);

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  onLogin() {
    // Reiniciar el mensaje de error
    this.errorMessage = '';

    // Verificar que los campos no estén vacíos
    if (!this.loginData.username || !this.loginData.password) {
      this.errorMessage = 'Por favor, ingresa tu usuario y contraseña.';
      this.cdr.detectChanges(); // Forzar la detección de cambios
      return;
    }

    // Realizar la solicitud de login
    this.authService.login(this.loginData).subscribe(
      response => {
        // Si se recibe el token, redirigir al usuario
        if (response?.token) {
          sessionStorage.setItem('token', response.token);
          this.router.navigate(['/layout/home']);
        }
      },
      error => {
        // Se asigna el mensaje de error proveniente del servicio
        this.errorMessage = error.message;
        this.cdr.detectChanges(); // Forzar la detección de cambios
      }
    );
  }

}
