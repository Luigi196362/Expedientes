import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-crear-pacientes',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatFormFieldModule,
    MatTabsModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatRadioModule,
    ReactiveFormsModule,
    RouterLink
    ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './crear-pacientes.component.html',
  styleUrls: ['./crear-pacientes.component.css']
})
export class CrearPacientesComponent {
  pacienteForm: FormGroup;

  constructor(private fb: FormBuilder, private dialog: MatDialog) {
    this.pacienteForm = this.fb.group({
      nombre: ['', Validators.required],
      estadoCivil: [''],
      origen: [''],
      fechaNacimiento: [null, Validators.required],
      sexo: [null, Validators.required],
      matricula: [''],
      semestre: [''],
      facultad: [''],
      grupo: [''],
      programaEducativo: [''],
      nss: [''],
      seguroFacultativo: [''],
      religion: [''],
      escolaridad: [''],
      telefono: [''],
      residencia: ['']
    });
  }

  isFormDirty(): boolean {
    return this.pacienteForm.dirty;  // Devuelve true si el formulario tiene cambios
  }


  onSave(): void {
    if (this.pacienteForm.valid) {
      // Lógica para guardar el paciente
      console.log('Paciente guardado', this.pacienteForm.value);
    } else {
      console.log('Formulario inválido');
    }
  }
}
