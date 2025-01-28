import { Routes } from '@angular/router';
import { PacienteListComponent } from '../pacientes/components/paciente-list/paciente-list.component';
import { PacienteCreateComponent } from './components/paciente-create/paciente-create.component';
import { UnsavedChangesGuard } from '../../core/guards/unsaved-changes.guard';

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
];
