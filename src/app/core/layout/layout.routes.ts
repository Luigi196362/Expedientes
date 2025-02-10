import { Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { PermissionGuard } from '../guards/permission.guard';
import { HomeComponent } from '../../pages/home/home.component';

export const layoutRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'pacientes',
        loadChildren: () =>
          import('../../pages/pacientes/pacientes.routes').then((m) => m.pacientesRoutes),
        canActivate: [PermissionGuard],
        data: { modulo: 'pacientes', accion: 'Ver' }
      },
      {
        path: 'usuarios',
        loadChildren: () =>
          import('../../pages/usuarios/usuarios.routes').then((m) => m.usuariosRoutes),
        canActivate: [PermissionGuard],
        data: { modulo: 'usuarios', accion: 'Ver' }
      },
      {
        path: 'roles',
        loadChildren: () =>
          import('../../pages/roles/roles.routes').then((m) => m.rolesRoutes),
        canActivate: [PermissionGuard],
        data: { modulo: 'roles', accion: 'Ver' }
      },
      {
        path: 'registros',
        loadChildren: () =>
          import('../../pages/registros/registros.routes').then((m) => m.registrosRoutes),
        canActivate: [PermissionGuard],
        data: { modulo: 'registros', accion: 'Ver' }
      },
      {

        path: 'home',
        component: HomeComponent,
        data: { title: 'Inicio' }

      }

    ],
  },
];
