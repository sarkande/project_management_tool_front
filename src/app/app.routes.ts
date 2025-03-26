import { Routes } from '@angular/router';
import { HOMEComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProjectComponent } from './pages/project/project.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeGuard } from './guards/home.guard';
import { TaskComponent } from './pages/task/task.component';
import { ProjectListComponent } from './pages/project-list/project-list.component';

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
        path: 'projects',
        component: ProjectListComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'project/:id',
        component: ProjectComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'project/:id/task/:taskId',
        component: TaskComponent,
        canActivate: [AuthGuard],
    },
    {
        path: '**',
        redirectTo: '',
    },
];
