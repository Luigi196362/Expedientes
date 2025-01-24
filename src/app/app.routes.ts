import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { NgModule } from '@angular/core';
import { HelloWorldComponent } from './pages/hello-world/hello-world.component';
import { AdminPacientesComponent } from './pages/admin-pacientes/admin-pacientes.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { RolesComponent } from './pages/roles/roles.component';
import { NotasEvolucionComponent } from './pages/notas-evolucion/notas-evolucion.component';
import { CrearNotasEvolucionComponent } from './pages/crear-notas-evolucion/crear-notas-evolucion.component';
import { CrearPacientesComponent } from './pages/crear-pacientes/crear-pacientes.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { UnsavedChangesGuard } from './guards/unsaved-changes.guard';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    {
        path: 'Menu', component: NavBarComponent,
        children: [
            { path: 'hello-world', component: HelloWorldComponent ,data: { title: 'Hello World' }},
            { path: 'Pacientes', component: AdminPacientesComponent ,data: { title: 'Administrar Pacientes' }},
            { path: 'Usuarios', component: UsuariosComponent , data: { title: 'Administrar Usuarios' }},
            { path: 'Roles', component: RolesComponent , data: { title: 'Administrar Roles' }},
            { path: 'Notas', component: NotasEvolucionComponent , data: { title: 'Notas' }},
            { path: 'crearNotas', component: CrearNotasEvolucionComponent , data: { title: 'Crear Notas' }},
            { path: 'Pacientes/Crear', component: CrearPacientesComponent , data: { title: 'Crear Pacientes' }, canDeactivate: [UnsavedChangesGuard] }
        ]
    },

    { path: '**', component: NotFoundComponent },

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }