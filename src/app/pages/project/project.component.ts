import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../interfaces/project';
import { User } from '../../interfaces/user';
import { AuthService } from '../../services/auth.service';
import { TaskService } from '../../services/task.service';
import { Task } from '../../interfaces/task';
import { FormManageUserProjectComponent } from '../../components/form-manage-user-project/form-manage-user-project.component';
import { FormTaskComponent } from '../../components/form-task/form-task.component';
import { StarRatingComponent } from '../../components/star-rating/star-rating.component';
import { Router } from '@angular/router';
import { TranslateStatusPipe } from '../../pipes/translate-status.pipe';

@Component({
    selector: 'app-project',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        FormManageUserProjectComponent,
        FormTaskComponent,
        StarRatingComponent,
        TranslateStatusPipe,
    ],
    templateUrl: './project.component.html',
    styleUrl: './project.component.scss',
})
export class ProjectComponent implements OnInit {
    project: Project | null = null;
    users: User[] = [];
    tasks: Task[] = [];

    currentUserRole = '';
    isOpenCreateTaskForm = false;

    constructor(
        private route: ActivatedRoute,
        private projectService: ProjectService,
        private authService: AuthService,
        private taskService: TaskService,
        private router: Router
    ) {}
    ngOnInit(): void {
        //get the id from the route
        console.log('Route params:', this.route.snapshot.params); // Log complet
        console.log('Project ID:', this.route.snapshot.params['id']); // Log spécifique

        if (!this.route.snapshot.params['id']) {
            return;
        }

        if (!this.authService.isLoggedIn()) {
            return;
        }
        const projectId = this.route.snapshot.params['id'];
        //Get the data for this project
        this.loadProjects(projectId);
        //get the lists of users assigned to this project
        this.handleRefreshUsers();

        //get the tasks for this project
        this.handleRefreshTasks();
    }

    get isUserAdmin(): boolean {
        return this.currentUserRole === 'Administrateur';
    }
    get isUserMember(): boolean {
        return this.currentUserRole === 'Membre';
    }
    get isUserWatcher(): boolean {
        return this.currentUserRole === 'Observateur';
    }
    loadProjects(projectId: number): void {
        this.projectService.getProject(projectId).subscribe({
            next: (project) => {
                this.project = project;
            },
            error: (error) => {
                console.error('Error:', error);
            },
        });
    }
    handleRefreshUsers(): void {
        this.projectService.getUsersByProject(this.project!.id).subscribe({
            next: (users) => {
                this.users = users as User[];
 
                //Extract the role of the current user for the project based on the authService
                this.currentUserRole = users.find(
                    (user: User) => user.id === this.authService.user!.id
                )?.role;
                if (!this.currentUserRole || this.currentUserRole === '') {
                    return;
                }
            },
            error: (error) => {
                console.error('Error:', error);
            },
        });
    }

    handleOpenCreateTaskForm(): void {
        this.isOpenCreateTaskForm = !this.isOpenCreateTaskForm;
    }

    handleRefreshTasks(): void {
        this.isOpenCreateTaskForm = false;
        this.taskService.getTasks(this.project!.id).subscribe({
            next: (tasks) => {
                this.tasks = tasks;
            },
            error: (error) => {
                console.error('Error:', error);
            },
        });
    }

    handleOpenTask(task: Task): void {
        if (!this.project || !task) {
            return;
        }
        this.router.navigate([`/project/${this.project!.id}/task/${task.id}`]);
    }
}
