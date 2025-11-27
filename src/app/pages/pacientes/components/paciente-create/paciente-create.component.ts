import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common'; // Added CommonModule
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats, provideNativeDateAdapter } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';
import { Paciente } from '../../models/paciente.model';
import { PacienteService } from '../../services/paciente.service';
import { ErrorDialogComponent } from '../../../../shared/error-dialog/error-dialog.component';
import { PacienteDialogComponent } from './paciente-dialog/paciente-dialog.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-paciente-create',
  standalone: true,
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX' },
    provideNativeDateAdapter(),
  ],
  imports: [
    MatFormFieldModule,
    MatTabsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterLink,
    MatAutocompleteModule,
    MatCheckboxModule,
    CommonModule, // Added CommonModule
    FormsModule,
    MatFormFieldModule, MatInputModule, MatDatepickerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './paciente-create.component.html',
  styleUrls: ['./paciente-create.component.css']
})
export class PacienteCreateComponent {
  nuevoPaciente: Paciente = new Paciente();
  pacienteForm: FormGroup;
  isSaving: boolean = false;
  minDate = new Date(1900, 0, 1);
  maxDate = new Date();

  // Flags for dynamic logic
  isStudent: boolean = false;
  isWorker: boolean = false;
  hablaLenguaIndigena: boolean = false;

  constructor(private fb: FormBuilder, private dialog: MatDialog, private pacienteSevice: PacienteService, private router: Router) {
    this.pacienteForm = this.fb.group({
      // Identificación
      tipo_paciente: ['', Validators.required],
      curp: ['', [Validators.required, Validators.minLength(18), Validators.maxLength(18)]],
      nombre: ['', Validators.required],
      fecha_nacimiento: [null, Validators.required],
      sexo: [null, Validators.required],
      estado_civil: ['', Validators.required],
      origen: ['', Validators.required],

      // Contacto y Ubicación
      telefono: ['', Validators.required],
      email: ['', [Validators.email]], // Optional but good validation
      calle: ['', Validators.required],
      numero_exterior: ['', Validators.required],
      numero_interior: [''],
      colonia: ['', Validators.required],
      cp: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
      municipio: ['', Validators.required],
      entidad_federativa: ['', Validators.required],

      // Responsable Legal
      nombre_responsable: [''], // Required logic handled dynamically or in HTML if simple
      parentesco_responsable: [''],
      telefono_responsable: [''],
      direccion_responsable: [''],

      // Afiliación Institucional (Estudiante)
      matricula: [''],
      facultad: [''],
      programa_educativo: [''],
      semestre: [''],
      grupo: [''],

      // Afiliación Institucional (Trabajador)
      numero_personal: [''],
      puesto: [''],
      area_adscripcion: [''],
      tipo_contratacion: [''],

      // Seguridad Social
      nss: [''],

      // Sociodemográfico
      ocupacion: ['', Validators.required],
      religion: ['', Validators.required],
      escolaridad: ['', Validators.required],
      // habla_lengua_indigena: [false],
      lengua_indigena: ['']
    });

    // Subscribe to changes
    this.pacienteForm.get('tipo_paciente')?.valueChanges.subscribe(value => {
      this.isStudent = value === 'Estudiante';
      this.isWorker = value === 'Docente' || value === 'Administrativo';
      this.updateValidators();
    });
  }

  updateValidators() {
    const studentFields = ['matricula', 'facultad', 'programa_educativo', 'semestre', 'grupo'];
    const workerFields = ['numero_personal', 'puesto', 'area_adscripcion', 'tipo_contratacion'];

    if (this.isStudent) {
      studentFields.forEach(field => this.pacienteForm.get(field)?.setValidators([Validators.required]));
      workerFields.forEach(field => {
        this.pacienteForm.get(field)?.clearValidators();
        this.pacienteForm.get(field)?.setValue('');
      });
    } else if (this.isWorker) {
      workerFields.forEach(field => this.pacienteForm.get(field)?.setValidators([Validators.required]));
      studentFields.forEach(field => {
        this.pacienteForm.get(field)?.clearValidators();
        this.pacienteForm.get(field)?.setValue('');
      });
    } else {
      // Externo or others
      [...studentFields, ...workerFields].forEach(field => {
        this.pacienteForm.get(field)?.clearValidators();
        this.pacienteForm.get(field)?.setValue('');
      });
    }

    // Update validity for all affected fields
    [...studentFields, ...workerFields].forEach(field => this.pacienteForm.get(field)?.updateValueAndValidity());
  }

  onHablaLenguaIndigenaChange(value: boolean) {
    this.hablaLenguaIndigena = value;
    const lenguaControl = this.pacienteForm.get('lengua_indigena');
    if (value) {
      lenguaControl?.setValidators([Validators.required]);
    } else {
      lenguaControl?.clearValidators();
      lenguaControl?.setValue('');
    }
    lenguaControl?.updateValueAndValidity();
  }


  isFormDirty(): boolean {
    return this.pacienteForm.dirty;  // Devuelve true si el formulario tiene cambios
  }

  onSave(): void {
    if (this.pacienteForm.valid) {
      this.isSaving = true; // Activar la bandera antes de abrir el diálogo

      // Abrir el diálogo de confirmación y esperar la respuesta del usuario
      const dialogRef = this.dialog.open(PacienteDialogComponent, { data: { paciente: this.pacienteForm.value } });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {  // Si el usuario confirma
          const nuevoPaciente: Paciente = { ...this.pacienteForm.value };

          this.pacienteSevice.guardarPaciente(nuevoPaciente).subscribe({
            next: () => {
              this.pacienteForm.markAsPristine();  // Restablecer el formulario
              this.router.navigate(['/layout/pacientes']);
              this.isSaving = false;  // Desactivar la bandera después de guardar
            },
            error: (error) => {
              this.dialog.open(ErrorDialogComponent, {
                data: { message: 'Error al guardar el paciente' }
              });
              console.error('Error al guardar el paciente:', error);
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
      //const dialogRef = this.dialog.open(VerificarPacienteComponent, { data: { paciente: this.pacienteForm.value } });
      this.dialog.open(ErrorDialogComponent, {
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

  // Limitar la longitud del input a la cantidad de dígitos especificada
  onInput(event: any, maxDigits: number): void {
    // Obtener el valor del input
    let inputValue = event.target.value;

    // Eliminar cualquier caracter no numérico
    inputValue = inputValue.replace(/[^0-9]/g, '');

    // Limitar a los dígitos especificados
    if (inputValue.length > maxDigits) {
      inputValue = inputValue.slice(0, maxDigits); // Recortar al número de dígitos permitido
    }

    // Asignar el valor limpio y limitado al input
    event.target.value = inputValue;
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

  get numerosIngresadosTelefono(): string {
    const telefono = this.pacienteForm.get('telefono')?.value || '';
    const numeros = telefono.replace(/\D/g, '').length; // Solo números
    return `${numeros}/10`; // Formato "0/10"
  }


  validarFecha(event: any) {
    const inputDate = new Date(event.target.value);
    const minDate = new Date(1900, 0, 1);

    if (inputDate < minDate) {
      event.target.value = '1900-01-01';
    }
  }

}
