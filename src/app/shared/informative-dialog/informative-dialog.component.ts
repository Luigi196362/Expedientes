import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { AuthService } from '../../core/services/Auth/auth.service';


@Component({
  selector: 'app-informative-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  templateUrl: './informative-dialog.component.html',
  styleUrl: './informative-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InformativeDialogComponent {
  constructor(
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: { message: string },
    private dialogRef: MatDialogRef<InformativeDialogComponent>
  ) { }

  closeDialog(): void {
    this.dialogRef.close();
  }

  Refreshtoken(): void {
    console.log('Renovando token...');
    this.authService.refreshToken().subscribe(() => {
      console.log('Token renovado correctamente desde el diálogo.');
    });
    this.dialogRef.close();
  }
}
