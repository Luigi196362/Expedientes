import { Routes } from '@angular/router';
import { UsuarioListComponent } from './components/usuario-list/usuario-list.component';
import { UsuarioCreateComponent } from './components/usuario-create/usuario-create.component';
import { UnsavedChangesGuard } from '../../core/guards/unsaved-changes.guard';

export const usuariosRoutes: Routes = [
    {
        path: '',
        component: UsuarioListComponent,
        data: { title: 'Administrar usuarios' }
    },
    {
        path: 'crear',
        component: UsuarioCreateComponent,
        data: { title: 'Crear usuarios' },
        canDeactivate: [UnsavedChangesGuard]
    },
];
