import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { Usuario } from '../../../models/usuario.model';

@Component({
  selector: 'app-usuario-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, CommonModule],
  templateUrl: './usuario-dialog.component.html',
  styleUrl: './usuario-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsuarioDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { usuario: Usuario },
    private dialogRef: MatDialogRef<UsuarioDialogComponent>) { }
  usuario = new Usuario();

  ngOnInit(): void {
    this.usuario = this.data.usuario;
  }
  // Método para cerrar el diálogo con un valor de confirmación (true) o cancelación (false)
  confirmar() {
    this.dialogRef.close(true);  // Le dice al componente que el usuario ha confirmado
  }

  cancelar() {
    this.dialogRef.close(false);  // Le dice al componente que el usuario ha cancelado
  }
}
