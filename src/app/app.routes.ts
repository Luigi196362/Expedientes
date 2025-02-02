import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './core/guards/AuthGuard.guard';
import { HelloWorldComponent } from './pages/hello-world/hello-world.component';

export const routes: Routes = [
    { path: '', component: LoginComponent, data: { title: 'login' } },
    {
        path: 'layout',
        loadChildren: () => import('./core/layout/layout.routes').then((m) => m.layoutRoutes), canActivate: [AuthGuard],
    },

    { path: 'hello', component: HelloWorldComponent },

    //Ruta por si no encuentra las anteriores rutas
    {
        path: '**', component: NotFoundComponent, data: { title: 'not-found' }
    },

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }