import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';
import { Paciente } from '../../models/Paciente';
import { PacienteService } from '../../services/Paciente/paciente.service';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { InvalidFormComponent } from '../../components/invalid-form/invalid-form.component';
import { VerificarPacienteComponent } from '../../components/verificar-paciente/verificar-paciente.component';

@Component({
  selector: 'app-crear-pacientes',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatFormFieldModule,
    MatTabsModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './crear-pacientes.component.html',
  styleUrls: ['./crear-pacientes.component.css']
})
export class CrearPacientesComponent {
  nuevoPaciente: Paciente = new Paciente();
  pacienteForm: FormGroup;
  isSaving: boolean = false;

  constructor(private fb: FormBuilder, private dialog: MatDialog,private pacienteSevice : PacienteService,private router: Router) {
    this.pacienteForm = this.fb.group({
      nombre: ['', Validators.required],
      estado_civil: ['', Validators.required],
      origen: ['',Validators.required],
      ocupacion: ['',Validators.required],
      fecha_nacimiento: [null, Validators.required],
      sexo: [null, Validators.required],
      matricula: ['',Validators.required],
      semestre: ['',Validators.required],
      facultad: ['',Validators.required],
      grupo: ['',Validators.required],
      programa_educativo: ['',Validators.required],
      nss: ['',Validators.required],
      religion: ['',Validators.required],
      escolaridad: ['',Validators.required],
      telefono: ['',Validators.required],
      residencia: ['',Validators.required]
    });
  }

  isFormDirty(): boolean {
    return this.pacienteForm.dirty;  // Devuelve true si el formulario tiene cambios
  }

onSave(): void {
  if (this.pacienteForm.valid) {
    this.isSaving = true; // Activar la bandera antes de abrir el diálogo

    // Abrir el diálogo de confirmación y esperar la respuesta del usuario
    const dialogRef = this.dialog.open(VerificarPacienteComponent,{data: { paciente: this.pacienteForm.value }});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {  // Si el usuario confirma
        const nuevoPaciente: Paciente = { ...this.pacienteForm.value };
        
        this.pacienteSevice.guardarPaciente(nuevoPaciente).subscribe({
          next: () => {
            this.pacienteForm.markAsPristine();  // Restablecer el formulario
            this.router.navigate(['/Menu/Pacientes']);
            this.isSaving = false;  // Desactivar la bandera después de guardar
          },
          error: (error) => {
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

  formatPhoneNumber(event: any,maxDigits: number): void {
    let value = event.target.value.replace(/\s+/g, '').replace(/\D/g, ''); // Eliminar espacios y caracteres no numéricos
    
    if (value.length > maxDigits) {
      value = value.slice(0, maxDigits); // Recortar al número de dígitos permitido
    }

    if (value.length > 3 && value.length <= 6) {
      value = value.replace(/(\d{3})(\d+)/, '$1 $2');
    } else if (value.length > 6) {
      value = value.replace(/(\d{3})(\d{3})(\d+)/, '$1 $2 $3');
    }
  
    event.target.value = value;  // Muestra el valor formateado con espacios
    
    // Si usas formControl, actualiza el valor sin espacios
    event.target.dispatchEvent(new Event('input'));  // Forzar actualización del formControl
  }
  

}
