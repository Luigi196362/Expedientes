import { Component, HostListener, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Nota_Evolucion } from '../../models/nota-evolucion';
import { RegistroService } from '../../services/registros/registros.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { PacienteDataComponent } from "../../../pacientes/components/paciente-data/paciente-data.component";
import { ErrorDialogComponent } from '../../../../shared/error-dialog/error-dialog.component';
import { PacienteDialogComponent } from '../../../pacientes/components/paciente-create/paciente-dialog/paciente-dialog.component';
import { Token } from '@angular/compiler';
import { AuthService } from '../../../../core/services/Auth/auth.service';
import { Paciente } from '../../../pacientes/models/paciente.model';

@Component({
  selector: 'app-crear-notas-evolucion',
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
    MatSidenavModule,
    PacienteDataComponent
  ],
  templateUrl: './crear-notas-evolucion.component.html',
  styleUrl: './crear-notas-evolucion.component.css'
})
export class CrearNotasEvolucionComponent implements OnInit {
  nota_evolucion: Nota_Evolucion = new Nota_Evolucion();
  notaForm: FormGroup;
  isSaving: boolean = false;
  // imc: number = 0.0;
  nameUser: string = "";
  idPaciente: number = 0;
  nombrePaciente: string = "";

  fieldLabels: { [key: string]: string } = {
    motivo_consulta: 'Motivo de consulta',
    interrogatorio: 'Interrogatorio',
    padecimiento_actual: 'Padecimiento actual',
    exploracion_fisica: 'Exploración física',
    peso: 'Peso',
    talla: 'Talla',
    imc: 'IMC',
    tension_arterial: 'Tensión arterial',
    frecuencia_cardiaca: 'Frecuencia cardiaca',
    frecuencia_respiratoria: 'Frecuencia respiratoria',
    temperatura: 'Temperatura',
    saturacion: 'Saturación',
    glicemia: 'Glicemia',
    hemoglobina: 'Hemoglobina',
    hemotipo: 'Hemotipo',
    diagnostico: 'Diagnóstico',
    tratamiento: 'Tratamiento',
    plan_tratamiento: 'Plan de tratamiento',
    observaciones: 'Observaciones'
  };
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
    this.calculateIMC();
  }
  calculateIMC() {
    const update = () => {
      const pesoStr = this.notaForm.get('peso')?.value;
      const tallaStr = this.notaForm.get('talla')?.value;

      const peso = parseFloat(pesoStr);
      let talla = parseFloat(tallaStr);

      if (!isNaN(peso) && !isNaN(talla) && talla > 0) {
        // Si la talla es mayor a 3, asumimos centímetros y convertimos a metros
        if (talla > 3) {
          talla = talla / 100;
        }
        const imc = peso / (talla * talla);
        this.notaForm.get('imc')?.setValue(imc.toFixed(2), { emitEvent: false });
      } else {
        this.notaForm.get('imc')?.setValue('');
      }
    };

    this.notaForm.get('peso')?.valueChanges.subscribe(update);
    this.notaForm.get('talla')?.valueChanges.subscribe(update);
  }

  constructor(private fb: FormBuilder, private dialog: MatDialog, private registrosService: RegistroService, private router: Router, private token: AuthService) {
    this.notaForm = this.fb.group({
      motivo_consulta: ['', Validators.required],
      interrogatorio: ['', Validators.required],
      padecimiento_actual: ['', Validators.required],
      exploracion_fisica: ['', Validators.required],

      peso: ['', Validators.required],
      talla: ['', Validators.required],
      imc: [{ value: '', disabled: true }],
      tension_arterial: ['', Validators.required],
      frecuencia_cardiaca: ['', Validators.required],
      frecuencia_respiratoria: ['', Validators.required],
      temperatura: ['', Validators.required],
      saturacion: ['', Validators.required],
      glicemia: ['', Validators.required],
      hemoglobina: ['', Validators.required],
      hemotipo: ['', Validators.required],

      diagnostico: ['', Validators.required],
      tratamiento: ['', Validators.required],
      plan_tratamiento: ['', Validators.required],
      observaciones: ['', Validators.required],
    });
  }

  isFormDirty(): boolean {
    return this.notaForm.dirty;
  }

  sidenavWidth = 400; // Ancho inicial
  isResizing = false;
  startX = 0;
  startWidth = 0;

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isResizing) {
      this.resize(event);
    }
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.stopResize();
  }

  startResize(event: MouseEvent): void {
    this.isResizing = true;
    this.startX = event.clientX;
    this.startWidth = this.sidenavWidth;
    event.preventDefault(); // Evitar selección de texto
  }

  resize(event: MouseEvent): void {
    const dx = this.startX - event.clientX; // Mover hacia la izquierda aumenta el ancho
    this.sidenavWidth = Math.max(300, this.startWidth + dx); // Mínimo 300px
  }

  stopResize(): void {
    this.isResizing = false;
  }

  toggleSidenav(sidenav: any): void {
    sidenav.toggle();  // Alterna la visibilidad del sidenav
  }



  onSave(): void {
    this.nameUser = this.token.getUsuario().sub;
    console.log(this.nameUser);
    if (this.notaForm.valid) {
      this.isSaving = true; // Activar la bandera antes de abrir el diálogo

      // Abrir el diálogo de confirmación y esperar la respuesta del usuario
      const dialogRef = this.dialog.open(PacienteDialogComponent, { data: { paciente: this.notaForm.getRawValue() } });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {  // Si el usuario confirma
          const nuevaNota: Nota_Evolucion = { ...this.notaForm.getRawValue() };

          this.registrosService.guardarNota(this.idPaciente, nuevaNota).subscribe({
            next: () => {
              this.notaForm.markAsPristine();  // Restablecer el formulario
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
      const controls = this.notaForm.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          invalidControls.push(this.fieldLabels[name] || name);
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

}
