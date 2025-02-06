import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { Router, RouterLink } from '@angular/router';
import { RolService } from '../../services/rol.service';
import { Rol } from '../../models/rol.model';
import { RolDialogComponent } from './rol-dialog/rol-dialog.component';
import { ErrorDialogComponent } from '../../../../shared/error-dialog/error-dialog.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { Permiso } from '../../models/permiso.model';
import { Accion } from '../../models/accion.model';
import { InformativeDialogComponent } from '../../../../shared/informative-dialog/informative-dialog.component';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-rol-create',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatTabsModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    ReactiveFormsModule,
    RouterLink,
    MatAutocompleteModule,
    MatCheckboxModule,
    CommonModule,
    MatIconModule
  ],
  templateUrl: './rol-create.component.html',
  styleUrl: './rol-create.component.css'
})
export class RolCreateComponent {

  nuevoRol: Rol = new Rol();
  rolForm: FormGroup;
  isSaving: boolean = false;
  acciones: Accion[] = [
    { nombre: "Crear", id: 1 },
    { nombre: "Editar", id: 2 },
    { nombre: "Eliminar", id: 3 },
    { nombre: "Ver", id: 4 },
    { nombre: "Exportar", id: 5 }
  ];
  permisos: Permiso[] = [
    { recurso: "Pacientes", id: 1, acciones: this.acciones },
    { recurso: "Usuarios", id: 2, acciones: this.acciones },
    { recurso: "Roles", id: 3, acciones: this.acciones }
  ];

  constructor(private fb: FormBuilder, private dialog: MatDialog, private rolService: RolService, private router: Router) {
    this.rolForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      permisos: this.fb.array([])
    });

    this.addPermisosControls();
  }

  get permisosFormArray(): FormArray {
    return this.rolForm.get('permisos') as FormArray;
  }

  // Inicializa los controles de permisos
  private addPermisosControls(): void {
    this.permisos.forEach(permiso => {
      const permisoGroup = this.fb.group({
        recursoId: [permiso.id, Validators.required],
        accionesIds: this.fb.array(permiso.acciones.map(() => this.fb.control(false)))
      });
      this.permisosFormArray.push(permisoGroup);
    });
  }

  // Devuelve el FormArray de acciones para el permiso en la posición 'index'
  getAcciones(index: number): FormArray {
    return (this.permisosFormArray.at(index).get('accionesIds') as FormArray);
  }

  // Función para acceder a un permiso específico de forma segura
  getPermisoControl(index: number): FormGroup {
    const permisoControl = this.permisosFormArray.at(index);
    if (permisoControl) {
      return permisoControl as FormGroup;
    }
    throw new Error(`El permiso con índice ${index} no existe.`);
  }


  isFormDirty(): boolean {
    return this.rolForm.dirty;  // Devuelve true si el formulario tiene cambios
  }
  onSave(): void {
    if (this.rolForm.valid) {
      // Creamos una copia del valor del formulario
      const formValue = { ...this.rolForm.value };

      // Recorremos cada permiso para transformar el array de booleanos en un array de IDs
      formValue.permisos = formValue.permisos.map((permiso: any) => {
        // Para cada posición en el array de accionesIds, si es true, se devuelve el id de la acción.
        // Suponemos que el array 'acciones' en el componente es el mismo para cada permiso.
        const accionesIdsTransformadas = permiso.accionesIds
          .map((checked: boolean, index: number) => checked ? this.acciones[index].id : null)
          .filter((id: number | null) => id !== null);

        return {
          ...permiso,
          accionesIds: accionesIdsTransformadas
        };
      });


      const dialogRef = this.dialog.open(RolDialogComponent, { data: { rol: formValue } });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // Si confirmaste, envías la data
          this.rolService.guardarRol(formValue).subscribe({
            next: () => {
              this.rolForm.markAsPristine();
              this.router.navigate(['/layout/roles']);
              this.isSaving = false;
            },
            error: (error) => {
              this.dialog.open(ErrorDialogComponent, {
                data: { message: 'Error al guardar el rol' }
              });
              console.error('Error al guardar el rol:', error);
              this.isSaving = false;
            }
          });
        } else {
          console.log('El usuario canceló la operación');
          this.isSaving = false;
        }
      });
    } else {
      this.dialog.open(ErrorDialogComponent, {
        data: { message: 'Formulario inválido' }
      });
      this.isSaving = false;
      console.log('Formulario inválido');
    }
  }


  mostrarinfo(): void {
    // Copia el valor actual del formulario
    const formValue = { ...this.rolForm.value };

    // Recorre cada permiso y transforma el array de booleanos en un array de IDs
    formValue.permisos = formValue.permisos.map((permiso: any) => {
      const accionesIdsTransformadas = permiso.accionesIds
        .map((checked: boolean, index: number) => checked ? this.acciones[index].id : null)
        .filter((id: number | null) => id !== null);

      return {
        ...permiso,
        accionesIds: accionesIdsTransformadas
      };
    });

    // Muestra la información transformada en la consola
    console.log('Información transformada del formulario:', formValue);

    // También la muestra en el diálogo informativo (opcional)
    this.dialog.open(InformativeDialogComponent, {
      data: {
        message: JSON.stringify(formValue, null, 2)
      }
    });
  }


  // Función que alterna (toggle) todos los checkboxes de un recurso
  toggleRecurso(index: number): void {
    const accionesArray = this.getAcciones(index);
    // Verifica si todos los checkboxes están marcados
    const todosMarcados = accionesArray.controls.every(control => control.value === true);
    // Si todos están marcados, se desmarcan; si no, se marcan todos.
    accionesArray.controls.forEach(control => control.setValue(!todosMarcados));
  }
}
