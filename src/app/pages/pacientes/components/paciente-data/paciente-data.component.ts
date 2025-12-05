import { Component, Input, OnInit } from '@angular/core';
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
import { CommonModule } from '@angular/common';
import { MatCard, MatCardModule } from '@angular/material/card';
import { AuthService } from '../../../../core/services/Auth/auth.service';
import { HistoriaDataComponent } from '../../../registros/components/historia-data/historia-data.component';
import { NotaDataComponent } from '../../../registros/components/nota-data/nota-data.component';

@Component({
  selector: 'app-paciente-data',
  standalone: true,
  imports: [
    MatCardModule,
    CommonModule,
    MatFormFieldModule,
    MatTabsModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatIconModule,
    MatIconModule,
    MatSelectModule,
    HistoriaDataComponent,
    NotaDataComponent
  ],
  templateUrl: './paciente-data.component.html',
  styleUrl: './paciente-data.component.css'
})
export class PacienteDataComponent implements OnInit {
  @Input() isSidenav: boolean = false;
  pacienteForm: FormGroup;
  paciente: Paciente | null = null;
  res: number = 0;
  habla_lengua_indigena: boolean = false;
  
  selectedRegistroId: number | null = null;
  selectedRegistroType: string | null = null;

  constructor(private fb: FormBuilder, private dialog: MatDialog, private pacienteService: PacienteService, private router: Router, public authService: AuthService) {
    this.pacienteForm = this.fb.group({
      // Identificación
      tipo_paciente: [''],
      curp: [''],
      nombre: ['', Validators.required],
      fecha_nacimiento: [null, Validators.required],
      sexo: [null, Validators.required],
      estado_civil: ['', Validators.required],
      origen: ['', Validators.required],

      // Contacto y Ubicación
      telefono: ['', Validators.required],
      email: [''],
      calle: [''],
      numero_exterior: [''],
      numero_interior: [''],
      colonia: [''],
      cp: [''],
      municipio: [''],
      entidad_federativa: [''],
      residencia: [''], // Keep for backward compatibility

      // Responsable
      nombre_responsable: [''],
      parentesco_responsable: [''],
      telefono_responsable: [''],
      direccion_responsable: [''],

      // Estudiante
      matricula: [''],
      facultad: [''],
      programa_educativo: [''],
      semestre: [''],
      grupo: [''],

      // Trabajador
      numero_personal: [''],
      puesto: [''],
      facultad_adscripcion: [''],
      tipo_contratacion: [''],

      // Seguridad Social
      nss: ['', Validators.required],

      // Sociodemográfico
      ocupacion: ['', Validators.required],
      religion: ['', Validators.required],
      escolaridad: ['', Validators.required],
     // habla_lengua_indigena: [false],
      lengua_indigena: [''] 
    });
    this.pacienteForm.disable();
  }

  ngOnInit(): void {
    const state = window.history.state;
    console.log('Estado:', state);

    if (state.id) {

      this.pacienteService.obtenerPacientePorId(state.id).subscribe(
        (data: Paciente) => {
          this.paciente = data;
          console.log('Paciente cargado para edición api:', this.paciente);
          this.pacienteForm.patchValue(this.paciente);
        },
        (error) => {
          console.error('Error al obtener usuarios:', error);
        }
      );
    } else if (state.paciente) {
        this.paciente = state.paciente;
        console.log('Paciente cargado desde estado:', this.paciente);
        if (this.paciente) {
            this.pacienteForm.patchValue(this.paciente);
        }
    } else {
      console.log('Error al cargar los datos:', this.paciente);

      this.router.navigate(['/layout/pacientes']);
    }
  }

  crearRegistro() {
    const numRegistros = this.paciente?.registros?.length || 0;
    const dialogRef = this.dialog.open(RegistroDialogComponent, {
      data: { numRegistros: numRegistros }
    });

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
        console.log(this.paciente)
        this.router.navigate(['/layout/pacientes/crearHistoriaClinica'], { state: { paciente: this.paciente } });
      }

      if (this.res == 2) {
        console.log('Redirigiendo a crear registro');
        console.log(window.history.state, "Enviar")
        this.router.navigate(['/layout/pacientes/crearNota'], { state: { paciente: this.paciente } });
      }
    });
  }
  datos(id : number, tipo_registro : String){
    if (this.isSidenav) {
        this.selectedRegistroId = id;
        this.selectedRegistroType = tipo_registro.toString();
    } else {
        if(tipo_registro === 'Historia Clínica'){
          this.router.navigate(['/layout/pacientes/infoHistoriaClinica'], { state: { registro_id: id } });
        }
        if(tipo_registro === 'Nota de Evolución'){
          this.router.navigate(['/layout/pacientes/infoNota'], { state: { registro_id: id } });
        }
    }
  }

  clearSelection() {
      this.selectedRegistroId = null;
      this.selectedRegistroType = null;
  }

}
