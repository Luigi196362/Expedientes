import { Routes } from '@angular/router';
import { RolListComponent } from './components/rol-list/rol-list.component';
import { RolCreateComponent } from './components/rol-create/rol-create.component';
import { UnsavedChangesGuard } from '../../core/guards/unsaved-changes.guard';

export const rolesRoutes: Routes = [
    {
        path: '',
        component: RolListComponent,
        data: { title: 'Administrar roles' }
    },
    {
        path: 'crear',
        component: RolCreateComponent,
        data: { title: 'Crear rol' },
        canDeactivate: [UnsavedChangesGuard]
    },
];
