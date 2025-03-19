import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { Router, RouterLink } from '@angular/router';
import { Historia_clinica } from '../../models/historia-clinica';
import { MatDialog } from '@angular/material/dialog';
import { RegistroService } from '../../services/registros/registros.service';
import { AuthService } from '../../../../core/services/Auth/auth.service';
import { PacienteDialogComponent } from '../../../pacientes/components/paciente-create/paciente-dialog/paciente-dialog.component';
import { ErrorDialogComponent } from '../../../../shared/error-dialog/error-dialog.component';

@Component({
  selector: 'app-crear-historia-clinica',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatTabsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterLink,
    MatAutocompleteModule,
    MatSidenavModule,],
  templateUrl: './crear-historia-clinica.component.html',
  styleUrl: './crear-historia-clinica.component.css'
})
export class CrearHistoriaClinicaComponent implements OnInit {
  historia_clinica: Historia_clinica = new Historia_clinica();
  historiaForm: FormGroup;
  isSaving: boolean = false;
  nameUser: string = "";
  idPaciente: number = 0;
  nombrePaciente: string = "";

  ngOnInit(): void {
    const state = window.history.state;
    if (state.paciente) {

      this.idPaciente = state.paciente.id;
      this.nombrePaciente = state.paciente.nombre;
      console.log('Id del usuario : ', this.idPaciente);

    } else {
      // Redirigir si no hay datos (por ejemplo, si se accede directamente a la URL)

      console.log('Error al cargar los datos',);
      //this.router.navigate(['/layout/pacientes']);
    }
  }

  constructor(private fb: FormBuilder, private dialog: MatDialog, private registrosService: RegistroService, private router: Router, private token: AuthService) {
    this.historiaForm = this.fb.group({
      id: [0, Validators.required],
      antecedentes_heredo_familiares: ['', Validators.required],
      antecedentes_personales_no_patologicos: ['', Validators.required],
      antecedentes_personales_patologicos: ['', Validators.required],
      medicamentos_actuales: ['', Validators.required],
      diagnostico_inicial: ['', Validators.required],
      tratamiento: ['', Validators.required],
      observaciones: ['', Validators.required],
      alergias: ['', Validators.required],

    });
  }

  isFormDirty(): boolean {
    return this.historiaForm.dirty;
  }

  toggleSidenav(sidenav: any): void {
    sidenav.toggle();  // Alterna la visibilidad del sidenav
  }


  onSave(): void {
    this.nameUser = this.token.getUsuario().sub;
    console.log(this.nameUser);
    if (this.historiaForm.valid) {
      this.isSaving = true; // Activar la bandera antes de abrir el diálogo

      // Abrir el diálogo de confirmación y esperar la respuesta del usuario
      const dialogRef = this.dialog.open(PacienteDialogComponent, { data: { paciente: this.historiaForm.value } });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {  // Si el usuario confirma
          const nuevaHistoria: Historia_clinica = { ...this.historiaForm.value };

          this.registrosService.guardarHistoria(this.nameUser, this.idPaciente, nuevaHistoria).subscribe({
            next: () => {
              this.historiaForm.markAsPristine();  // Restablecer el formulario
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
}
