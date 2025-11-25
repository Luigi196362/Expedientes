import { ChangeDetectionStrategy, Component, inject, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro-dialog',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, CommonModule],
  templateUrl: './registro-dialog.component.html',
  styleUrls: ['./registro-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistroDialogComponent {

  readonly dialogRef = inject(MatDialogRef<RegistroDialogComponent>);
  readonly data = inject(MAT_DIALOG_DATA);
  selectedValue: number = 0;

  Cancelar() {
    this.dialogRef.close();
  }

  CrearRegistro() {
    this.dialogRef.close(this.selectedValue);
  }
}
