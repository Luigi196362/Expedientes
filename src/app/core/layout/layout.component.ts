import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, interval, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { RouterModule, RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { LogoutConfirmDialogComponent } from './logout-confirm-dialog/logout-confirm-dialog.component';
import { AuthService } from '../services/Auth/auth.service';
import { MatSlideToggle, MatSlideToggleModule } from '@angular/material/slide-toggle';

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
    AsyncPipe,
    RouterLink,
    RouterOutlet,
    CommonModule,
    MatSlideToggleModule
  ]
})
export class LayoutComponent implements OnInit, OnDestroy {
  pageTitle = '';
  currentDate: Date = new Date();
  isDarkTheme: boolean = false;
  timeInterval: any;
  private clockSubscription!: Subscription;

  constructor(
    private cdr: ChangeDetectorRef,
    public authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title
  ) { }

  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  ngOnInit(): void {
    // Actualizar el título de la página según la ruta activa
    this.isDarkTheme = document.body.classList.contains('dark-theme');
    this.router.events.subscribe(() => {
      const childRoute = this.getChild(this.route);
      if (childRoute && childRoute.snapshot.data['title']) {
        this.pageTitle = childRoute.snapshot.data['title'];
        this.titleService.setTitle(this.pageTitle);
      }
    });

    // Verificar si la ruta inicial ya tiene título.
    const childRoute = this.getChild(this.route);
    if (childRoute && childRoute.snapshot.data['title']) {
      this.pageTitle = childRoute.snapshot.data['title'];
      this.titleService.setTitle(this.pageTitle);
    }

    // Suscribirse al interval para actualizar la hora cada segundo
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

  // Método para obtener la ruta hija activa
  private getChild(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }

  // Mostrar mensaje en pantalla
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



}
