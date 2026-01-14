import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { Router, RouterLink } from '@angular/router';
import { ErrorDialogComponent } from '../../../../shared/error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioDialogComponent } from './usuario-dialog/usuario-dialog.component';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Rol } from '../../../roles/models/rol.model';
import { RolService } from '../../../roles/services/rol.service';
import { CommonModule } from '@angular/common';
import { FACULTADES } from '../../../../core/constants/faculties.const';

interface Roles {
  value: number;
  viewValue: String;
}

@Component({
  selector: 'app-usuario-create',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatTabsModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    ReactiveFormsModule,
    RouterLink,
    MatAutocompleteModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  templateUrl: './usuario-create.component.html',
  styleUrl: './usuario-create.component.css'
})
export class UsuarioCreateComponent implements OnInit {

  nuevoUsuario: Usuario = new Usuario();
  usuarioForm: FormGroup;
  isSaving: boolean = false;
  roles: Roles[] = [];
  facultades = FACULTADES;


  hide = signal(true);

  fieldLabels: { [key: string]: string } = {
    nombre: 'Nombre',
    curp: 'CURP',
    rfc: 'RFC',
    cedulaProfesional: 'Cédula profesional',
    especialidad: 'Especialidad',
    telefono: 'Teléfono',
    rolId: 'Rol',
    facultad: 'Facultad',
    pasante: 'Pasante',
    password: 'Contraseña'
  };


  constructor(private fb: FormBuilder, private dialog: MatDialog, private rolService: RolService, private usuarioService: UsuarioService, private router: Router) {
    this.usuarioForm = this.fb.group({
      nombre: ['', Validators.required],
      curp: ['', Validators.required],
      rfc: ['', Validators.required],
      cedulaProfesional: ['', Validators.required],
      especialidad: ['', Validators.required],
      telefono: ['', Validators.required],
      rolId: ['', Validators.required],
      facultad: ['', Validators.required],
      pasante: [false],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*[\W_]).*$/)]]
    });

    this.usuarioForm.get('pasante')?.valueChanges.subscribe(isPasante => {
      const cedulaControl = this.usuarioForm.get('cedulaProfesional');
      const especialidadControl = this.usuarioForm.get('especialidad');
      if (isPasante) {
        cedulaControl?.clearValidators();
        cedulaControl?.setValue('');
        cedulaControl?.disable();
        especialidadControl?.clearValidators();
        especialidadControl?.setValue('');
        especialidadControl?.disable();
      } else {
        cedulaControl?.setValidators([Validators.required]);
        cedulaControl?.enable();
        especialidadControl?.setValidators([Validators.required]);
        especialidadControl?.enable();
      }
      cedulaControl?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    this.rolService.getRolesNombres().subscribe(
      (roles: Rol[]) => {
        this.roles = roles.map(role => ({ value: role.id, viewValue: role.nombre }));
      },
      (error: any) => {
        console.error('Error al obtener usuarios:', error);
      }
    );
  }


  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  isFormDirty(): boolean {
    return this.usuarioForm.dirty;  // Devuelve true si el formulario tiene cambios
  }

  onSave(): void {
    if (this.usuarioForm.valid) {
      this.isSaving = true; // Activar la bandera antes de abrir el diálogo

      // Abrir el diálogo de confirmación y esperar la respuesta del usuario
      const selectedRole = this.roles.find(role => role.value === this.usuarioForm.value.rol);
      const dialogRef = this.dialog.open(UsuarioDialogComponent, { data: { usuario: { ...this.usuarioForm.value, rol: selectedRole?.viewValue } } });

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
              this.dialog.open(ErrorDialogComponent, {
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
      const invalidControls = [];
      const controls = this.usuarioForm.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          let label = this.fieldLabels[name] || name;
          if (controls[name].errors?.['required']) {
            label += ' (Requerido)';
          } else if (controls[name].errors?.['minlength'] || controls[name].errors?.['maxlength']) {
            label += ' (Longitud incorrecta)';
          } else if (controls[name].errors?.['pattern']) {
            label += ' (Formato inválido)';
          }
          invalidControls.push(label);
        }
      }
      console.log('Campos inválidos:', invalidControls);

      this.dialog.open(ErrorDialogComponent, {
        data: {
          message: 'Formulario inválido. Por favor revise los siguientes campos:',
          details: invalidControls
        }
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