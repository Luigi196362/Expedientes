import { Routes } from '@angular/router';
import { PacienteListComponent } from '../pacientes/components/paciente-list/paciente-list.component';
import { PacienteCreateComponent } from './components/paciente-create/paciente-create.component';
import { UnsavedChangesGuard } from '../../core/guards/UnsavedChanges.guard';
import { PacienteDataComponent } from './components/paciente-data/paciente-data.component';
import { CrearNotasEvolucionComponent } from '../registros/components/crear-notas-evolucion/crear-notas-evolucion.component';
import { CrearHistoriaClinicaComponent } from '../registros/components/crear-historia-clinica/crear-historia-clinica.component';
import { NotaDataComponent } from '../registros/components/nota-data/nota-data.component';
import { HistoriaDataComponent } from '../registros/components/historia-data/historia-data.component';

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
    {
        path: 'infoNota',
        component: NotaDataComponent,
        data: { title: 'Informacion de la nota de evolucion' },
        canDeactivate: [UnsavedChangesGuard]
    },
    {
        path: 'infoHistoriaClinica',
        component: HistoriaDataComponent,
        data: { title: 'Informacion de la historia clinica' },
        canDeactivate: [UnsavedChangesGuard]
    },
];
