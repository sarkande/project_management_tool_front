import { Routes } from '@angular/router';
import { HOMEComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProjectComponent } from './pages/project/project.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeGuard } from './guards/home.guard';

export const routes: Routes = [
    {
        path: '',
        component: HOMEComponent,
        canActivate: [HomeGuard],
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'projects/:id',
        component: ProjectComponent,
        canActivate: [AuthGuard],
    },
    {
        path: '**',
        redirectTo: '',
    },
];
