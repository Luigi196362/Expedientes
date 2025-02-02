import { Routes } from '@angular/router';
import { UsuarioListComponent } from './components/usuario-list/usuario-list.component';
import { UsuarioCreateComponent } from './components/usuario-create/usuario-create.component';
import { UnsavedChangesGuard } from '../../core/guards/UnsavedChanges.guard';
import { UsuarioEditComponent } from './components/usuario-edit/usuario-edit.component';

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
    {
        path: 'editar',
        component: UsuarioEditComponent,
        data: { title: 'Editar usuario' },
        canDeactivate: [UnsavedChangesGuard]
    },
];
