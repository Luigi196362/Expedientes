import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PacienteService } from '../../services/paciente.service';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Paciente } from '../../models/paciente.model';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RegistroDialogComponent } from './registro-dialog/registro-dialog.component';
import { ErrorDialogComponent } from '../../../../shared/error-dialog/error-dialog.component';
import { InformativeDialogComponent } from '../../../../shared/informative-dialog/informative-dialog.component';

@Component({
  selector: 'app-paciente-data',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatTabsModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatIconModule,
    MatSelectModule
  ],
  templateUrl: './paciente-data.component.html',
  styleUrl: './paciente-data.component.css'
})
export class PacienteDataComponent implements OnInit {
  pacienteForm: FormGroup;
  paciente: Paciente | null = null;
  res: number = 0;

  constructor(private fb: FormBuilder, private dialog: MatDialog, private usuarioService: PacienteService, private router: Router) {
    this.pacienteForm = this.fb.group({
      nombre: ['', Validators.required],
      estado_civil: ['', Validators.required],
      origen: ['', Validators.required],
      ocupacion: ['', Validators.required],
      fecha_nacimiento: [null, Validators.required],
      sexo: [null, Validators.required],
      matricula: ['', Validators.required],
      semestre: ['', Validators.required],
      facultad: ['', Validators.required],
      grupo: ['', Validators.required],
      programa_educativo: ['', Validators.required],
      nss: ['', Validators.required],
      religion: ['', Validators.required],
      escolaridad: ['', Validators.required],
      telefono: ['', Validators.required],
      residencia: ['', Validators.required]

    });
    this.pacienteForm.disable();
  }

  ngOnInit(): void {
    const state = window.history.state;
    console.log('Estado:', state.paciente);
    if (state.paciente) {
      this.paciente = state.paciente;

      console.log('Usuario cargado para edición:', this.paciente);
      this.pacienteForm.patchValue(state.paciente);
    } else {
      // Redirigir si no hay datos (por ejemplo, si se accede directamente a la URL)

      console.log('Error al cargar los datos:', this.paciente);
      //this.router.navigate(['/layout/pacientes']);
    }
  }

  crearRegistro() {
    const dialogRef = this.dialog.open(RegistroDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.res = result;

      if (this.res === 0) {
        this.dialog.open(ErrorDialogComponent, { data: { message: 'Es necesario elegir una opcion' } });
      }
      // if (this.res > 2 || this.res < 2 && this.res !== 0) {
      //   this.dialog.open(InformativeDialogComponent, { data: { message: 'Pagina no disponible por el momento, opcion elegida:' + this.res } });
      // }

      if (this.res == 1) {
        console.log('Redirigiendo a crear registro');
        console.log(window.history.state, "Enviar")
        this.router.navigate(['/layout/registros/crearHistoriaClinica'], { state: { paciente: this.paciente } });
      }

      if (this.res == 2) {
        console.log('Redirigiendo a crear registro');
        console.log(window.history.state, "Enviar")
        this.router.navigate(['/layout/registros/crearNota'], { state: { paciente: this.paciente } });
      }
    });
  }
}
