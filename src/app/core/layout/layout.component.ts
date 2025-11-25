import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';

import { Subscription } from 'rxjs';
import { RouterModule, RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { LogoutConfirmDialogComponent } from './logout-confirm-dialog/logout-confirm-dialog.component';
import { AuthService } from '../services/Auth/auth.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Usuario } from '../../pages/usuarios/models/usuario.model';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  standalone: true,
  imports: [
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    RouterLink,
    RouterOutlet,
    CommonModule,
    MatSlideToggleModule
  ]
})
export class LayoutComponent implements OnInit, OnDestroy {
  pageTitle = '';
  currentDate: Date = new Date();
  isDarkTheme?: boolean;
  timeInterval: any;
  nombre?: String | null;
  isSidebarExpanded = false;

  private clockSubscription!: Subscription;

  constructor(
    private cdr: ChangeDetectorRef,
    public authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.nombre = this.authService.getNombre();
    console.log('Usuario:', this.nombre);
    this.isDarkTheme = document.body.classList.contains('dark-theme');

    this.timeInterval = setInterval(() => {
      this.currentDate = new Date();
      this.cdr.detectChanges();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.clockSubscription) {
      this.clockSubscription.unsubscribe();
    }
  }

  readonly dialog = inject(MatDialog);

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(LogoutConfirmDialogComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
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
  }

  toggleSidebar(): void {
    this.isSidebarExpanded = !this.isSidebarExpanded;
  }



}
