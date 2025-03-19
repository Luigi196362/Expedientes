import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro-dialog',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  templateUrl: './registro-dialog.component.html',
  styleUrls: ['./registro-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistroDialogComponent {

  readonly dialogRef = inject(MatDialogRef<RegistroDialogComponent>);
  selectedValue: number = 0;

  Cancelar() {
    this.dialogRef.close();
  }

  CrearRegistro() {
    this.dialogRef.close(this.selectedValue);
  }
}
