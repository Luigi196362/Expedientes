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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UsuarioDialogEditComponent } from './usuario-dialog-edit/usuario-dialog-edit.component';
import { CommonModule } from '@angular/common';
import { FACULTADES } from '../../../../core/constants/faculties.const';

interface Roles {
  value: number;
  viewValue: String;
}

@Component({
  selector: 'app-usuario-edit',
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
  templateUrl: './usuario-edit.component.html',
  styleUrl: './usuario-edit.component.css'
})
export class UsuarioEditComponent implements OnInit {
  usuarioForm: FormGroup;
  isSaving: boolean = false;
  usuario: Usuario | null = null;
  roles: Roles[] = [];
  facultades = FACULTADES;

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

  constructor(private fb: FormBuilder, private dialog: MatDialog, private usuarioService: UsuarioService, private router: Router, private rolService: RolService) {
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
      password: ['', [Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*[\W_]).*$/)]]
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
      especialidadControl?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    const state = window.history.state;

    // console.log('Estado recibido:', state);

    if (state.id) {
      this.usuarioService.obtenerUsuarioPorId(state.id).subscribe(
        (data: Usuario) => {
          this.usuario = data;
          console.log('Usuario cargado para edición api:', this.usuario);
          this.usuarioForm.patchValue(this.usuario);
          this.usuarioForm.updateValueAndValidity();
        },
        (error) => {
          console.error('Error al obtener usuarios:', error);
        }
      );
    } else {
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
    return this.usuarioForm.dirty;
  }

  onSave(): void {
    console.log('Formulario válido:', this.usuarioForm.controls['curp'].value);
    if (this.usuarioForm.valid) {
      this.isSaving = true;

      const formData = this.usuarioForm.value;

      const selectedRole = this.roles.find(role => role.value === formData.rolId);

      const usuarioParaVerificacion = {
        ...formData,
        rol: selectedRole ? selectedRole.viewValue : formData.rolId
      };

      const dialogRef = this.dialog.open(UsuarioDialogEditComponent, { data: { usuario: usuarioParaVerificacion } });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
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
