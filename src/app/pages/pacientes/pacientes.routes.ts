import { Routes } from '@angular/router';
import { PacienteListComponent } from '../pacientes/components/paciente-list/paciente-list.component';
import { PacienteCreateComponent } from './components/paciente-create/paciente-create.component';
import { UnsavedChangesGuard } from '../../core/guards/UnsavedChanges.guard';
import { PacienteDataComponent } from './components/paciente-data/paciente-data.component';

export const pacientesRoutes: Routes = [
    {
        path: '',
        component: PacienteListComponent,
        data: { title: 'Administrar pacientes' }
    },
    {
        path: 'crear',
        component: PacienteCreateComponent,
        data: { title: 'Crear pacientes' },
        canDeactivate: [UnsavedChangesGuard]
    },
    {
        path: 'datos',
        component: PacienteDataComponent,
        data: { title: 'Informacion del paciente' },
    },
];
