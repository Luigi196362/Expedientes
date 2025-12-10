import { ChangeDetectionStrategy, Component, NgModule, signal, ChangeDetectorRef, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/Auth/auth.service';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    CommonModule,
    MatSlideToggleModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  loginData = { username: '', password: '' };
  errorMessage: string = '';
  isDarkTheme?: boolean;

  constructor(
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.isDarkTheme = document.body.classList.contains('dark-theme');
  }

  onLogin() {

    this.errorMessage = '';

    if (!this.loginData.username || !this.loginData.password) {
      this.errorMessage = 'Por favor, ingresa tu usuario y contraseña.';
      this.cdr.detectChanges();
      return;
    }

    this.authService.login(this.loginData).subscribe(
      response => {
        if (response?.token) {
          sessionStorage.setItem('token', response.token);
          this.router.navigate(['/layout/home']);
        }
      },
      error => {
        this.errorMessage = error.message;
        this.cdr.detectChanges();
      }
    );
  }

  toggleDarkTheme(isDark: boolean): void {
    this.isDarkTheme = isDark;

    const body = document.body;
    if (isDark) {
      body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
    this.cdr.detectChanges();
  }

}
