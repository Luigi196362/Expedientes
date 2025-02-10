import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './core/guards/AuthGuard.guard';
import { HelloWorldComponent } from './pages/hello-world/hello-world.component';
import { LoginGuard } from './core/guards/LoginGuard.guard';

export const routes: Routes = [
    { path: '', component: LoginComponent, data: { title: 'login' }, canActivate: [LoginGuard] },
    {
        path: 'layout',
        loadChildren: () => import('./core/layout/layout.routes').then((m) => m.layoutRoutes), canActivate: [AuthGuard],
    },

    { path: 'hello', component: HelloWorldComponent },

    {
        path: '404',
        component: NotFoundComponent,
        data: { title: 'not-found' }
    },
    // Redirecciona cualquier ruta no encontrada a la de error 404
    {
        path: '**',
        redirectTo: '404'
    }

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }