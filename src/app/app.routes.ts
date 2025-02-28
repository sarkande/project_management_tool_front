import { Routes } from '@angular/router';
import { HOMEComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProjectComponent } from './pages/project/project.component';

export const routes: Routes = [
    {
        path: '',
        component: HOMEComponent,
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
    },
    {
        path: 'projects/:id',
        component: ProjectComponent,
    },
    {
        path: '**',
        redirectTo: '',
    },
];
