import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { Rol } from '../../../models/rol.model';


@Component({
  selector: 'app-rol-dialog-edit',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, CommonModule],
  templateUrl: './rol-dialog-edit.component.html',
  styleUrl: './rol-dialog-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolDialogEditComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { rol: Rol },
    private dialogRef: MatDialogRef<RolDialogEditComponent>) { }
  rol = new Rol();

  ngOnInit(): void {
    this.rol = this.data.rol;
    this.rol = this.data.rol;
  }
  // Método para cerrar el diálogo con un valor de confirmación (true) o cancelación (false)
  confirmar() {
    this.dialogRef.close(true);  // Le dice al componente que el usuario ha confirmado
  }

  cancelar() {
    this.dialogRef.close(false);  // Le dice al componente que el usuario ha cancelado
  }
}
