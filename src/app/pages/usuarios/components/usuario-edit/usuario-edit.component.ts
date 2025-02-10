import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { Router, RouterLink } from '@angular/router';
import { ErrorDialogComponent } from '../../../../shared/error-dialog/error-dialog.component';
import { Usuario } from '../../models/usuario.model';
import { UsuarioDialogComponent } from '../usuario-create/usuario-dialog/usuario-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioService } from '../../services/usuario.service';
import { RolService } from '../../../roles/services/rol.service';
import { Rol } from '../../../roles/models/rol.model';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { UsuarioDialogEditComponent } from './usuario-dialog-edit/usuario-dialog-edit.component';

interface Roles {
  value: number;
  viewValue: String;
}

@Component({
  selector: 'app-usuario-edit',
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
    MatIconModule,
    MatSelectModule
  ],
  templateUrl: './usuario-edit.component.html',
  styleUrl: './usuario-edit.component.css'
})
export class UsuarioEditComponent implements OnInit {
  usuarioForm: FormGroup;
  isSaving: boolean = false;
  usuario: Usuario | null = null;
  roles: Roles[] = [];

  constructor(private fb: FormBuilder, private dialog: MatDialog, private usuarioService: UsuarioService, private router: Router, private rolService: RolService) {
    this.usuarioForm = this.fb.group({
      username: ['', Validators.required],
      telefono: ['', Validators.required],
      rol: [null, Validators.required],
      facultad: ['', Validators.required],
      password: ['']
    });
  }

  ngOnInit(): void {
    const state = window.history.state;
    if (state.usuario) {
      this.usuario = state.usuario;
      if (this.usuario) {
        this.usuario.rol = state.usuario.rolId;
      }
      console.log('Usuario cargado para edición:', this.usuario);
      this.usuarioForm.patchValue(state.usuario);
    } else {
      // Redirigir si no hay datos (por ejemplo, si se accede directamente a la URL)
      this.router.navigate(['/layout/usuarios']);
    }

    this.rolService.getRolesNombres().subscribe(
      (roles: Rol[]) => {
        this.roles = roles.map(role => ({ value: role.id, viewValue: role.nombre }));
      },
      (error: any) => {
        console.error('Error al obtener usuarios:', error);
      }
    );
  }


  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  isFormDirty(): boolean {
    return this.usuarioForm.dirty;  // Devuelve true si el formulario tiene cambios
  }
  onSave(): void {
    if (this.usuarioForm.valid) {
      this.isSaving = true;

      // Obtenemos el valor actual del formulario.
      const formData = this.usuarioForm.value;

      // Buscamos en el arreglo 'roles' el rol cuyo 'value' (id) coincida con el seleccionado.
      const selectedRole = this.roles.find(role => role.value === formData.rol);

      // Creamos un objeto para la verificación que muestre el nombre del rol en lugar del id.
      const usuarioParaVerificacion = {
        ...formData,
        rol: selectedRole ? selectedRole.viewValue : formData.rol
      };

      // Abrimos el diálogo de verificación pasando el objeto transformado.
      const dialogRef = this.dialog.open(UsuarioDialogEditComponent, { data: { usuario: usuarioParaVerificacion } });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // Si el usuario confirma, se utiliza el objeto original (que contiene el id del rol) para actualizar.
          const nuevoUsuario: Usuario = { ...formData };

          if (this.usuario && this.usuario.id) {
            this.usuarioService.actualizarUsuario(this.usuario.id, nuevoUsuario).subscribe({
              next: () => {
                this.usuarioForm.markAsPristine();
                this.router.navigate(['/layout/usuarios']);
                this.isSaving = false;
              },
              error: (error) => {
                this.dialog.open(ErrorDialogComponent, {
                  data: { message: 'Error al guardar el usuario' }
                });
                console.error('Error al guardar el usuario:', error);
                this.isSaving = false;
              }
            });
          } else {
            console.error('No se pudo actualizar: usuario no definido.');
            this.dialog.open(ErrorDialogComponent, {
              data: { message: 'Error: No se encontró el usuario a editar' }
            });
            this.isSaving = false;
          }
        } else {
          console.log('El usuario canceló la operación');
          this.isSaving = false;
        }
      });
    } else {
      this.dialog.open(ErrorDialogComponent, {
        data: { message: 'Formulario inválido' }
      });
      this.isSaving = false;
      console.log('Formulario inválido');
    }
  }


  // Bloquear caracteres no numéricos en el campo de teléfono
  blockInvalidChars(event: KeyboardEvent, maxDigits: number): void {
    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  // Controlar el pegado de texto en el campo de teléfono
  onPaste(event: ClipboardEvent, maxDigits: number): void {
    const pastedText = event.clipboardData?.getData('text') || '';

    if (pastedText.length > maxDigits) {
      event.preventDefault();
    }
  }

  formatPhoneNumber(event: Event, maxLength: number): void {
    const inputElement = event.target as HTMLInputElement;

    let cleaned = inputElement.value.replace(/\D/g, '');

    if (cleaned.length > maxLength) {
      cleaned = cleaned.substring(0, maxLength);
    }

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
