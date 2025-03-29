import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { Project } from '../../interfaces/project';
import { CommonModule } from '@angular/common';
import { User } from '../../interfaces/user';
import { FormProjectComponent } from '../../components/form-project/form-project.component';
import { ProjectWithRole } from '../../interfaces/project-with-role';
import { Router } from '@angular/router';
@Component({
    selector: 'app-project-list',
    standalone: true,
    imports: [CommonModule, FormProjectComponent],
    templateUrl: './project-list.component.html',
    styleUrl: './project-list.component.scss',
})
export class ProjectListComponent implements OnInit {
    constructor(
        private authService: AuthService,
        private userService: UserService,
        private projectService: ProjectService,
        private router: Router
    ) {}
    projects: ProjectWithRole[] = [];
    user!: User | null;

    isOpenCreateProjectForm = false;

    successMessage = '';
    errorMessage = '';

    ngOnInit(): void {
        if (!this.authService.isLoggedIn()) this.authService.logout();

        this.user = this.authService.user;
        if (!this.user) return;

        this.userService.getProjects(this.user.id).subscribe({
            next: (projects) => {
                this.projects = projects;
            },
            error: (error) => {
                console.error('Error:', error);
            },
        });
    }

    logout() {
        this.authService.logout();
    }
    toggleCreateProjectForm() {
        this.isOpenCreateProjectForm = !this.isOpenCreateProjectForm;
    }

    createProject(projectData: Project) {
        this.successMessage = '';
        this.errorMessage = '';

        console.error('Received project data:', projectData);
        // Traitez ici les données du projet, comme les envoyer à un service ou les stocker
        this.projectService
            .createProject(projectData, this.user!.id)
            .subscribe({
                next: (response) => {
                    projectData.id = response;
                    let projectWithRole: ProjectWithRole = {
                        ...projectData,
                        role: 'Administrateur',
                    };

                    this.projects.push(projectWithRole);
                    this.isOpenCreateProjectForm = false;
                    this.successMessage = 'Projet créé avec succès';
                },
                error: (error) => {
                    console.error('Erreur:', error);
                    switch (error.status) {
                        case 0:
                            this.errorMessage = 'Le serveur est injoignable';
                            break;
                        case 401:
                            this.errorMessage = 'Non autorisé';
                            break;
                        case 403:
                            this.errorMessage = 'Interdit';
                            break;
                        case 404:
                            this.errorMessage = 'Non trouvé';
                            break;
                        case 500:
                            this.errorMessage = 'Erreur interne du serveur';
                            break;
                        default:
                            this.errorMessage = 'Une erreur est survenue';
                            break;
                    }
                },
            });
    }

    navigateToProject(projectId: number) {
        this.router.navigate(['/project', projectId]);
    }

    navigateToDashboard() {
        this.router.navigate(['/dashboard']);
    }
}
