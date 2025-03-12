import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../interfaces/project';
import { User } from '../../interfaces/user';
import { AuthService } from '../../services/auth.service';
import { TaskService } from '../../services/task.service';
import { Task } from '../../interfaces/task';
import { FormManageUserProjectComponent } from "../../components/form-manage-user-project/form-manage-user-project.component";

@Component({
    selector: 'app-project',
    standalone: true,
    imports: [CommonModule, RouterModule, FormManageUserProjectComponent, FormManageUserProjectComponent],
    templateUrl: './project.component.html',
    styleUrl: './project.component.scss',
})
export class ProjectComponent implements OnInit {
    project: Project | null = null;
    users: User[] = [];
    tasks: Task[] = [];

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

    handleAddUserToProject(event: any): void {
        //prevent default
        event.preventDefault();
        console.log('Event:', event);
        if (event.userMail === '') {
            console.log('User mail is empty');
            return;
        }
        let role = this.convertRoleToFrench(event.role);
        if (!this.isRoleAvailable(role)) {
            console.log('Role is not available');
            return;
        }

        this.addUserToProject(event.userMail, role);
    }

    addUserToProject(userMail: string, role: string): void {
        console.log('Checking if current user is admin');
        if (!this.isUserAdmin) {
            console.log('Current user is not admin');
            return;
        }

        console.log('Checking if project is defined');
        if (!this.project) {
            console.log('Project is not defined');
            return;
        }

        console.log('Checking if userMail is empty');
        if (userMail === '') {
            console.log('User mail is empty');
            return;
        }

        if (!this.isRoleAvailable(role)) return;

        this.projectService
            .addUserToProject(
                this.project.id,
                userMail,
                role,
                this.authService.user!.id
            )
            .subscribe({
                next: (response) => {
                    console.log('Response:', response);
                    let newUser: User = {
                        id: response,
                        email: userMail,
                        role: role,
                        username: userMail,
                    };
                    this.users.push(newUser);
                },
                error: (error) => {
                    console.log('Error:', error);
                },
            });
    }

    isRoleAvailable(role: string): boolean {
        console.log('Role:', role);
        return (
            role === 'Administrateur' ||
            role === 'Membre' ||
            role === 'Observateur'
        );
    }

    convertRoleToFrench(role: string): string {
        console.log('Role:', role);
        switch (role) {
            case 'admin':
                return 'Administrateur';
            case 'member':
                return 'Membre';
            case 'watcher':
                return 'Observateur';
            default:
                return 'Inconnu';
        }
    }
}
