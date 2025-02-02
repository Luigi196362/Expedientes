import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { Router, RouterLink } from '@angular/router';
import { RolService } from '../../services/rol.service';
import { Rol } from '../../models/rol.model';
import { RolDialogComponent } from './rol-dialog/rol-dialog.component';
import { ErrorDialogComponent } from '../../../../shared/error-dialog/error-dialog.component';


@Component({
  selector: 'app-rol-create',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatTabsModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    ReactiveFormsModule,
    RouterLink,
    MatAutocompleteModule,
  ],
  templateUrl: './rol-create.component.html',
  styleUrl: './rol-create.component.css'
})
export class RolCreateComponent {

  nuevoRol: Rol = new Rol();
  rolForm: FormGroup;
  isSaving: boolean = false;

  constructor(private fb: FormBuilder, private dialog: MatDialog, private rolService: RolService, private router: Router) {
    this.rolForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      admin: [null, Validators.required],
    });
  }

  isFormDirty(): boolean {
    return this.rolForm.dirty;  // Devuelve true si el formulario tiene cambios
  }

  onSave(): void {
    if (this.rolForm.valid) {
      this.isSaving = true; // Activar la bandera antes de abrir el diálogo

      // Abrir el diálogo de confirmación y esperar la respuesta del usuario
      const dialogRef = this.dialog.open(RolDialogComponent, { data: { rol: this.rolForm.value } });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {  // Si el usuario confirma
          const nuevoRol: Rol = { ...this.rolForm.value };

          this.rolService.guardarRol(nuevoRol).subscribe({
            next: () => {
              this.rolForm.markAsPristine();  // Restablecer el formulario
              this.router.navigate(['/layout/roles']);
              this.isSaving = false;  // Desactivar la bandera después de guardar
            },
            error: (error) => {
              this.dialog.open(ErrorDialogComponent, {
                data: { message: 'Error al guardar el rol' }
              });
              console.error('Error al guardar el rol:', error);
              this.isSaving = false;
            }
          });
        } else {
          console.log('El usuario canceló la operación');
          this.isSaving = false;  // Desactivar la bandera si el usuario cancela
        }
      });

    } else {
      // Mostrar diálogo de error si el formulario no es válido
      this.dialog.open(ErrorDialogComponent, {
        data: { message: 'Formulario inválido' }
      });
      this.isSaving = false;  // Desactivar la bandera en caso de error
      console.log('Formulario inválido');
    }
  }


}
