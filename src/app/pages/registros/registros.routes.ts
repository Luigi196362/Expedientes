import { Routes } from '@angular/router';
import { NotasEvolucionComponent } from './components/notas-evolucion/notas-evolucion.component';
import { CrearNotasEvolucionComponent } from './components/crear-notas-evolucion/crear-notas-evolucion.component';

export const registrosRoutes: Routes = [
    {
        path: '',
        component: NotasEvolucionComponent,
        data: { title: 'Administrar registros' }
    },
    {
        path: 'crear',
        component: CrearNotasEvolucionComponent,
        data: { title: 'Crear nota' }
    },
];
