import { Routes } from '@angular/router';
import { layoutComponent } from './layout.component';

export const layoutRoutes: Routes = [
  {
    path: '',
    component: layoutComponent,
    children: [
      {
        path: 'pacientes',
        loadChildren: () =>
          import('../../pages/pacientes/pacientes.routes').then((m) => m.pacientesRoutes)
      },
      {
        path: 'usuarios',
        loadChildren: () =>
          import('../../pages/usuarios/usuarios.routes').then((m) => m.usuariosRoutes)
      },
      {
        path: 'roles',
        loadChildren: () =>
          import('../../pages/roles/roles.routes').then((m) => m.rolesRoutes)
      },
      {
        path: 'registros',
        loadChildren: () =>
          import('../../pages/registros/registros.routes').then((m) => m.registrosRoutes)
      }
    ],
  },
];
