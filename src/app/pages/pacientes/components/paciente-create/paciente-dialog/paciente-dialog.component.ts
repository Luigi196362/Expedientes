import { ChangeDetectionStrategy, Component, Inject, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { Paciente } from '../../../models/paciente.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paciente-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, CommonModule],
  templateUrl: './paciente-dialog.component.html',
  styleUrl: './paciente-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PacienteDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { paciente: Paciente },
    private dialogRef: MatDialogRef<PacienteDialogComponent>) { }
  paciente = new Paciente();

  ngOnInit(): void {
    this.paciente = this.data.paciente;
  }
  // Método para cerrar el diálogo con un valor de confirmación (true) o cancelación (false)
  confirmar() {
    this.dialogRef.close(true);  // Le dice al componente que el usuario ha confirmado
  }

  cancelar() {
    this.dialogRef.close(false);  // Le dice al componente que el usuario ha cancelado
  }
}
