import { Routes } from '@angular/router';
import { RegistroComponent } from './components/registro-list/registro-list.component';
import { CrearNotasEvolucionComponent } from './components/crear-notas-evolucion/crear-notas-evolucion.component';
import { UnsavedChangesGuard } from '../../core/guards/UnsavedChanges.guard';
import { CrearHistoriaClinicaComponent } from './components/crear-historia-clinica/crear-historia-clinica.component';

export const registrosRoutes: Routes = [
    {
        path: '',
        component: RegistroComponent,
        data: { title: 'Administrar registros' }
    },
    {
        path: 'crearNota',
        component: CrearNotasEvolucionComponent,
        data: { title: 'Crear nota de evolucion' },
        canDeactivate: [UnsavedChangesGuard]
    },
    {
        path: 'crearHistoriaClinica',
        component: CrearHistoriaClinicaComponent,
        data: { title: 'Crear historia clinica' },
        canDeactivate: [UnsavedChangesGuard]
    },
];
