import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout-confirm-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  templateUrl: './logout-confirm-dialog.component.html',
  styleUrl: './logout-confirm-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoutConfirmDialogComponent {
  constructor(private router: Router) { }

  readonly dialogRef = inject(MatDialogRef<LogoutConfirmDialogComponent>);


  CerrarSesion() {
    this.dialogRef.close();
    this.router.navigate(['/']);
  }

}
