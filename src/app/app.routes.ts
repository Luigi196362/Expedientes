import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { HelloWorldComponent } from './pages/hello-world/hello-world.component';

export const routes: Routes = [{
    path:'hello-world',component:HelloWorldComponent
}];
