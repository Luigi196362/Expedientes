import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { Router, RouterLink } from '@angular/router';
import { InvalidFormComponent } from '../../../../shared/invalid-form/invalid-form.component';
import { MatDialog } from '@angular/material/dialog';
import { PacienteDialogComponent } from '../../../pacientes/components/paciente-create/paciente-dialog/paciente-dialog.component';
import { MatIcon } from '@angular/material/icon';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-usuario-create',
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
    MatIcon
  ],
  templateUrl: './usuario-create.component.html',
  styleUrl: './usuario-create.component.css'
})
export class UsuarioCreateComponent {

  nuevoUsuario: Usuario = new Usuario();
  usuarioForm: FormGroup;
  isSaving: boolean = false;

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  constructor(private fb: FormBuilder, private dialog: MatDialog, private usuarioService: UsuarioService, private router: Router) {
    this.usuarioForm = this.fb.group({
      nombre: ['', Validators.required],
      telefono: ['', Validators.required],
      rol: [null, Validators.required],
      facultad: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  isFormDirty(): boolean {
    return this.usuarioForm.dirty;  // Devuelve true si el formulario tiene cambios
  }

  onSave(): void {
    if (this.usuarioForm.valid) {
      this.isSaving = true; // Activar la bandera antes de abrir el diálogo

      // Abrir el diálogo de confirmación y esperar la respuesta del usuario
      const dialogRef = this.dialog.open(PacienteDialogComponent, { data: { rol: this.usuarioForm.value } });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {  // Si el usuario confirma
          const nuevoUsuario: Usuario = { ...this.usuarioForm.value };

          this.usuarioService.guardarUsuario(nuevoUsuario).subscribe({
            next: () => {
              this.usuarioForm.markAsPristine();  // Restablecer el formulario
              this.router.navigate(['/layout/usuarios']);
              this.isSaving = false;  // Desactivar la bandera después de guardar
            },
            error: (error) => {
              this.dialog.open(InvalidFormComponent, {
                data: { message: 'Error al guardar el usuario' }
              });
              console.error('Error al guardar el usuario:', error);
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
      this.dialog.open(InvalidFormComponent, {
        data: { message: 'Formulario inválido' }
      });
      this.isSaving = false;  // Desactivar la bandera en caso de error
      console.log('Formulario inválido');
    }
  }


  // Bloquear caracteres no numéricos
  blockInvalidChars(event: KeyboardEvent, maxDigits: number): void {
    // Permitir solo números del 0 al 9
    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  // Controlar el pegado de texto
  onPaste(event: ClipboardEvent, maxDigits: number): void {
    const pastedText = event.clipboardData?.getData('text') || '';

    // Si el texto pegado tiene más de los dígitos permitidos, prevenir el pegado
    if (pastedText.length > maxDigits) {
      event.preventDefault();
    }
  }
  formatPhoneNumber(event: Event, maxLength: number): void {
    const inputElement = event.target as HTMLInputElement;

    // Eliminar todos los caracteres no numéricos
    let cleaned = inputElement.value.replace(/\D/g, '');

    // Limitar la longitud máxima a 10 dígitos
    if (cleaned.length > maxLength) {
      cleaned = cleaned.substring(0, maxLength);
    }

    // Aplicar formato dinámico durante la escritura
    let formattedNumber = '';
    if (cleaned.length > 0) {
      formattedNumber += '(' + cleaned.substring(0, Math.min(3, cleaned.length));
    }
    if (cleaned.length > 3) {
      formattedNumber += ') ' + cleaned.substring(3, Math.min(6, cleaned.length));
    }
    if (cleaned.length > 6) {
      formattedNumber += '-' + cleaned.substring(6, maxLength);
    }

    inputElement.value = formattedNumber;
  }

}