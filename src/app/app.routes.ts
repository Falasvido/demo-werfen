import { Routes } from '@angular/router';
import { GridComponent } from './components/grid-component/grid-component';
import { CreateUserComponent } from './components/create-user-component/create-user-component';

export const routes: Routes = [
    { path: 'main', component: GridComponent },
    { path: 'form', component: CreateUserComponent },
    { path: '**', redirectTo: '/main' }
];
