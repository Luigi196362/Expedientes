import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { RouterModule, RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogClose,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
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
    RouterOutlet
  ]
})
export class NavBarComponent implements OnInit {
  pageTitle = '';

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private titleService: Title
  ) { }

  ngOnInit(): void {
    // Suscripción a cambios de la ruta activa
    this.router.events.subscribe(() => {
      const childRoute = this.getChild(this.route);
      if (childRoute && childRoute.snapshot.data['title']) {
        this.pageTitle = childRoute.snapshot.data['title']; // Actualizar el título
        this.titleService.setTitle(this.pageTitle); // Cambiar el título en la pestaña
      }
    });

    // También verificar si la ruta inicial ya tiene un título.
    const childRoute = this.getChild(this.route);
    if (childRoute && childRoute.snapshot.data['title']) {
      this.pageTitle = childRoute.snapshot.data['title']; // Actualizar el título
      this.titleService.setTitle(this.pageTitle); // Cambiar el título en la pestaña
    }
  }

  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  // Método para obtener la ruta hija activa
  private getChild(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }

//Mostrar mensaje en pantalla
  readonly dialog = inject(MatDialog);

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(MensajeComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }
}

@Component({
  selector: 'app-mensaje',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  templateUrl: './mensaje.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MensajeComponent {
  readonly dialogRef = inject(MatDialogRef<MensajeComponent>);


  CerrarSesion() {
    this.dialogRef.close();
    window.location.href = ' ';
  }
}