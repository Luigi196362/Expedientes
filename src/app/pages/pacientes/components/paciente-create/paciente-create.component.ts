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
import { PostalCodeService, PostalCodeData } from '../../../../core/services/postal-code.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FACULTADES } from '../../../../core/constants/faculties.const';

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
    CommonModule,
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
  colonias: string[] = [];
  postalCodeError: string | null = null;
  colonias_responsable: string[] = [];
  postalCodeError_responsable: string | null = null;
  facultades = FACULTADES;

  fieldLabels: { [key: string]: string } = {
    tipo_paciente: 'Tipo de paciente',
    curp: 'CURP',
    nombre: 'Nombre',
    fecha_nacimiento: 'Fecha de nacimiento',
    sexo: 'Sexo',
    estado_civil: 'Estado civil',
    origen: 'Origen',
    telefono: 'Teléfono',
    email: 'Correo electrónico',
    calle: 'Calle',
    numero_exterior: 'Número exterior',
    numero_interior: 'Número interior',
    colonia: 'Colonia',
    cp: 'Código postal',
    municipio: 'Municipio',
    entidad_federativa: 'Entidad federativa',
    nombre_responsable: 'Nombre del responsable',
    parentesco_responsable: 'Parentesco del responsable',
    telefono_responsable: 'Teléfono del responsable',
    calle_responsable: 'Calle del responsable',
    numero_exterior_responsable: 'Número exterior del responsable',
    numero_interior_responsable: 'Número interior del responsable',
    colonia_responsable: 'Colonia del responsable',
    cp_responsable: 'Código postal del responsable',
    municipio_responsable: 'Municipio del responsable',
    entidad_federativa_responsable: 'Entidad federativa del responsable',
    matricula: 'Matrícula',
    facultad: 'Facultad',
    programa_educativo: 'Programa educativo',
    semestre: 'Semestre',
    grupo: 'Grupo',
    numero_personal: 'Número de personal',
    puesto: 'Puesto',
    tipo_contratacion: 'Tipo de contratación',
    nss: 'NSS',
    religion: 'Religión',
    escolaridad: 'Escolaridad',
    lengua_indigena: 'Lengua indígena'
  };

  constructor(private fb: FormBuilder, private dialog: MatDialog, private pacienteSevice: PacienteService, private router: Router, private postalCodeService: PostalCodeService) {
    this.pacienteForm = this.fb.group({
      // Identificación
      tipo_paciente: ['', Validators.required],
      curp: ['', [Validators.minLength(18), Validators.maxLength(18)]],
      nombre: ['', Validators.required],
      fecha_nacimiento: [null, Validators.required],
      sexo: [null, Validators.required],
      estado_civil: [''],
      origen: [''],

      // Contacto y Ubicación
      telefono: ['', Validators.required],
      email: ['', [Validators.email]],
      calle: [''],
      numero_exterior: [''],
      numero_interior: [''],
      colonia: [{ value: '', disabled: true }, Validators.required],
      cp: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
      municipio: [{ value: '', disabled: true }, Validators.required],
      entidad_federativa: [{ value: '', disabled: true }, Validators.required],

      // Responsable Legal
      nombre_responsable: [''],
      parentesco_responsable: [''],
      telefono_responsable: [''],
      calle_responsable: [''],
      numero_exterior_responsable: [''],
      numero_interior_responsable: [''],
      colonia_responsable: [{ value: '', disabled: true }],
      cp_responsable: ['', [Validators.pattern('^[0-9]{5}$')]],
      municipio_responsable: [{ value: '', disabled: true }],
      entidad_federativa_responsable: [{ value: '', disabled: true }],

      // Afiliación Institucional (Estudiante)
      matricula: [''],
      facultad: [''],
      programa_educativo: [''],
      semestre: [''],
      grupo: [''],

      // Afiliación Institucional (Trabajador)
      numero_personal: [''],
      puesto: [''],
      tipo_contratacion: [''],

      // Seguridad Social
      nss: [''],

      // Sociodemográfico
      religion: [''],
      escolaridad: [''],
      lengua_indigena: ['']
    });

    // Subscribe to changes
    this.pacienteForm.get('tipo_paciente')?.valueChanges.subscribe(value => {
      this.isStudent = value === 'Estudiante';
      this.isWorker = value === 'Docente' || value === 'Administrativo';
      this.updateValidators();
    });

    this.pacienteForm.get('cp')?.valueChanges.subscribe(value => {
      if (value && value.length === 5) {
        this.postalCodeService.getSettlements(value).subscribe(data => {
          if (data.length > 0) {
            this.postalCodeError = null;
            this.colonias = data.map(d => d.asentamiento);
            this.pacienteForm.patchValue({
              municipio: data[0].municipio,
              entidad_federativa: data[0].estado,
              colonia: this.colonias.length === 1 ? this.colonias[0] : ''
            });
            this.pacienteForm.get('colonia')?.enable();
          } else {
            this.colonias = [];
            this.postalCodeError = 'Código postal no encontrado';
            this.pacienteForm.patchValue({
              municipio: '',
              entidad_federativa: '',
              colonia: ''
            });
            this.pacienteForm.get('colonia')?.disable();
          }
        });
      } else {
        this.colonias = [];
        this.postalCodeError = null;
        this.pacienteForm.patchValue({
          municipio: '',
          entidad_federativa: '',
          colonia: ''
        });
        this.pacienteForm.get('colonia')?.disable();
      }
    });

    this.pacienteForm.get('cp_responsable')?.valueChanges.subscribe(value => {
      if (value && value.length === 5) {
        this.postalCodeService.getSettlements(value).subscribe(data => {
          if (data.length > 0) {
            this.postalCodeError_responsable = null;
            this.colonias_responsable = data.map(d => d.asentamiento);
            this.pacienteForm.patchValue({
              municipio_responsable: data[0].municipio,
              entidad_federativa_responsable: data[0].estado,
              colonia_responsable: this.colonias_responsable.length === 1 ? this.colonias_responsable[0] : ''
            });
            this.pacienteForm.get('colonia_responsable')?.enable();
          } else {
            this.colonias_responsable = [];
            this.postalCodeError_responsable = 'Código postal no encontrado';
            this.pacienteForm.patchValue({
              municipio_responsable: '',
              entidad_federativa_responsable: '',
              colonia_responsable: ''
            });
            this.pacienteForm.get('colonia_responsable')?.disable();
          }
        });
      } else {
        this.colonias_responsable = [];
        this.postalCodeError_responsable = null;
        this.pacienteForm.patchValue({
          municipio_responsable: '',
          entidad_federativa_responsable: '',
          colonia_responsable: ''
        });
        this.pacienteForm.get('colonia_responsable')?.disable();
      }
    });
  }

  updateValidators() {
    const studentFields = ['matricula', 'programa_educativo', 'semestre', 'grupo'];
    const workerFields = ['numero_personal', 'puesto', 'tipo_contratacion'];
    const sharedFields = ['facultad'];

    if (this.isStudent) {
      // Validate Student fields
      studentFields.forEach(field => this.pacienteForm.get(field)?.setValidators([Validators.required]));
      // Validate Shared fields
      sharedFields.forEach(field => this.pacienteForm.get(field)?.setValidators([Validators.required]));

      // Clear Worker fields
      workerFields.forEach(field => {
        this.pacienteForm.get(field)?.clearValidators();
        this.pacienteForm.get(field)?.setValue('');
      });
    } else if (this.isWorker) {
      // Validate Worker fields
      workerFields.forEach(field => this.pacienteForm.get(field)?.setValidators([Validators.required]));
      // Validate Shared fields
      sharedFields.forEach(field => this.pacienteForm.get(field)?.setValidators([Validators.required]));

      // Clear Student fields
      studentFields.forEach(field => {
        this.pacienteForm.get(field)?.clearValidators();
        this.pacienteForm.get(field)?.setValue('');
      });
    } else {
      // Clear all fields if neither
      [...studentFields, ...workerFields, ...sharedFields].forEach(field => {
        this.pacienteForm.get(field)?.clearValidators();
        this.pacienteForm.get(field)?.setValue('');
      });
    }
    // Update validity for all potentially affected fields
    [...studentFields, ...workerFields, ...sharedFields].forEach(field => this.pacienteForm.get(field)?.updateValueAndValidity());
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
      const dialogRef = this.dialog.open(PacienteDialogComponent, { data: { paciente: this.pacienteForm.getRawValue() } });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {  // Si el usuario confirma
          const nuevoPaciente: Paciente = { ...this.pacienteForm.getRawValue() };

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
      const invalidControls = [];
      const controls = this.pacienteForm.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          let label = this.fieldLabels[name] || name;
          if (controls[name].errors?.['required']) {
            label += ' (Requerido)';
          } else if (controls[name].errors?.['minlength'] || controls[name].errors?.['maxlength']) {
            label += ' (Longitud incorrecta)';
          } else if (controls[name].errors?.['pattern']) {
            label += ' (Formato inválido)';
          } else if (controls[name].errors?.['email']) {
            label += ' (Email inválido)';
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
