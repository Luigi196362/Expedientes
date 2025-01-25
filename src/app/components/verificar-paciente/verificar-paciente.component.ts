import { ChangeDetectionStrategy, Component, Inject, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Paciente } from '../../models/Paciente';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verificar-paciente',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent,CommonModule],
  templateUrl: './verificar-paciente.component.html',
  styleUrl: './verificar-paciente.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerificarPacienteComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { paciente: Paciente },
      private dialogRef: MatDialogRef<VerificarPacienteComponent>) {}
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
