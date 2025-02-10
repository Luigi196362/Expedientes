import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Rol } from '../../models/rol.model';
import { MatDialog } from '@angular/material/dialog';
import { RolService } from '../../services/rol.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { InformativeDialogComponent } from '../../../../shared/informative-dialog/informative-dialog.component';
import { ErrorDialogComponent } from '../../../../shared/error-dialog/error-dialog.component';
import { RolDialogComponent } from '../rol-create/rol-dialog/rol-dialog.component';
import { Accion } from '../../models/accion.model';
import { Permiso } from '../../models/permiso.model';

@Component({
  selector: 'app-rol-edit',
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
  templateUrl: './rol-edit.component.html',
  styleUrls: ['./rol-edit.component.css']
})
export class RolEditComponent implements OnInit {

  rol: Rol | null = null;
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
    { recurso: "Registros", id: 3, acciones: this.acciones },
    { recurso: "Roles", id: 4, acciones: this.acciones }
  ];

  constructor(private fb: FormBuilder, private dialog: MatDialog, private rolService: RolService, private router: Router) {
    this.rolForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      permisos: this.fb.array([])
    });

    this.addPermisosControls();
  }

  ngOnInit(): void {
    const state = window.history.state;
    if (state.rol) {
      this.rol = state.rol;

      console.log('Rol cargado para edición:', this.rol);

      // Asignamos los valores básicos del rol
      this.rolForm.patchValue({
        nombre: this.rol?.nombre,
        descripcion: this.rol?.descripcion,
      });

      // Recorremos cada permiso del rol recibido y lo sincronizamos según el recursoId
      // Se asume que this.rol.permisos tiene la estructura { recursoId: number, accionesIds: number[] }
      this.rol?.permisos.forEach((permisoFromRol: any) => {
        // Buscamos el índice del permiso en nuestro arreglo de permisos mediante el recursoId
        const index = this.permisos.findIndex(permiso => permiso.id === permisoFromRol.recursoId);
        if (index !== -1) {
          const accionesArray = this.getAcciones(index);
          // Por cada acción definida en el componente, marcamos el checkbox si corresponde
          this.acciones.forEach((accion, j) => {
            const checked = permisoFromRol.accionesIds.includes(accion.id);
            accionesArray.at(j).setValue(checked);
          });
        }
      });
    } else {
      // Si no se pasa un rol en el state, redirigimos a la lista de roles
      this.router.navigate(['/layout/roles']);
    }
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

  // Acceso seguro a un permiso específico
  getPermisoControl(index: number): FormGroup {
    const permisoControl = this.permisosFormArray.at(index);
    if (permisoControl) {
      return permisoControl as FormGroup;
    }
    throw new Error(`El permiso con índice ${index} no existe.`);
  }

  isFormDirty(): boolean {
    return this.rolForm.dirty;
  }

  onSave(): void {
    if (this.rolForm.valid) {
      const formValue = { ...this.rolForm.value };

      // Transformamos el array de booleanos en un array de IDs para cada permiso
      formValue.permisos = formValue.permisos.map((permiso: any) => {
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
          // Si se confirma la acción, actualizamos el rol
          if (this.rol && this.rol.id) {
            this.rolService.actualizarRol(this.rol.id, formValue).subscribe({
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
            console.error('No se pudo actualizar: rol no definido.');
            this.dialog.open(ErrorDialogComponent, {
              data: { message: 'Error: No se encontró el rol a editar' }
            });
            this.isSaving = false;
          }
        } else {
          console.log('El rol canceló la operación');
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
    const formValue = { ...this.rolForm.value };

    formValue.permisos = formValue.permisos.map((permiso: any) => {
      const accionesIdsTransformadas = permiso.accionesIds
        .map((checked: boolean, index: number) => checked ? this.acciones[index].id : null)
        .filter((id: number | null) => id !== null);

      return {
        ...permiso,
        accionesIds: accionesIdsTransformadas
      };
    });

    console.log('Información transformada del formulario:', formValue);

    this.dialog.open(InformativeDialogComponent, {
      data: {
        message: JSON.stringify(formValue, null, 2)
      }
    });
  }

  // Función que alterna (toggle) todos los checkboxes de un recurso
  toggleRecurso(index: number): void {
    const accionesArray = this.getAcciones(index);
    const todosMarcados = accionesArray.controls.every(control => control.value === true);
    accionesArray.controls.forEach(control => control.setValue(!todosMarcados));
  }
}
