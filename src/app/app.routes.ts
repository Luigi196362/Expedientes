import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelloWorldComponent } from './pages/hello-world/hello-world.component';
import { LoginComponent } from './pages/login/login.component';
import { AdminPacientesComponent } from './pages/admin-pacientes/admin-pacientes.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { RolesComponent } from './pages/roles/roles.component';
import { NotasEvolucionComponent } from './pages/notas-evolucion/notas-evolucion.component';
import { CrearNotasEvolucionComponent } from './pages/crear-notas-evolucion/crear-notas-evolucion.component';
import { CrearPacientesComponent } from './pages/crear-pacientes/crear-pacientes.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'hello-world', component: HelloWorldComponent },
    { path: 'Pacientes', component: AdminPacientesComponent },
    { path: 'Usuarios', component: UsuariosComponent },
    { path: 'Roles', component: RolesComponent },
    { path: 'Notas', component: NotasEvolucionComponent },
    { path: 'crearNotas', component: CrearNotasEvolucionComponent },
    { path: 'Pacientes/Crear', component: CrearPacientesComponent },
    { path: '**', component: NotFoundComponent },

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }