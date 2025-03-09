import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../interfaces/project';
import { User } from '../../interfaces/user';
import { AuthService } from '../../services/auth.service';
import { TaskService } from '../../services/task.service';
import { Task } from '../../interfaces/task';

@Component({
    selector: 'app-project',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './project.component.html',
    styleUrl: './project.component.scss',
})
export class ProjectComponent implements OnInit {
    project: Project | null = null;
    users: User[] | [] = [];
    tasks: Task[] | [] = [];

    currentUserRole = '';
    constructor(
        private projectService: ProjectService,
        private route: ActivatedRoute,
        private authService: AuthService,
        private taskService: TaskService
    ) {}
    ngOnInit(): void {
        //get the id from the route
        if (!this.route.snapshot.params['id']) {
            return;
        }
        const projectId = this.route.snapshot.params['id'];

        if (!this.authService.isLoggedIn()) {
            return;
        }
        const currentUser = this.authService.user;

        //Get the data for this project
        this.projectService.getProject(projectId).subscribe({
            next: (project) => {
                console.log('Project:', project);
                this.project = project;
            },
            error: (error) => {
                console.log('Error:', error);
            },
        });

        //get the lists of users assigned to this project
        this.projectService.getUsersByProject(projectId).subscribe({
            next: (users) => {
                console.log('Users:', users);

                this.users = users as User[];

                //Extract the role of the current user for the project based on the authService
                this.currentUserRole = users.find(
                    (user: User) => user.id === currentUser!.id
                )?.role;
                if (!this.currentUserRole || this.currentUserRole === '') {
                    console.log('Current user role not found');
                    return;
                }
                console.log('Current user role:', this.currentUserRole);
            },
            error: (error) => {
                console.log('Error:', error);
            },
        });

        //get the tasks for this project
        this.taskService.getTasks(projectId).subscribe({
            next: (tasks) => {
                console.log('Tasks:', tasks);
                this.tasks = tasks;
            },
            error: (error) => {
                console.log('Error:', error);
            },
        });
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
}
