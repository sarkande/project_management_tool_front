import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../services/project.service';
import { User } from '../../interfaces/user';

@Component({
    selector: 'app-form-manage-user-project',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, CommonModule],
    templateUrl: './form-manage-user-project.component.html',
    styleUrl: './form-manage-user-project.component.scss',
})
export class FormManageUserProjectComponent {
    @Input() projectId!: number;
    @Output() refreshUsers = new EventEmitter<void>();

    userForm: FormGroup;
    user!: User | null;

    errorMessage = '';
    successMessage = '';

    constructor(
        private authService: AuthService,
        private projectService: ProjectService
    ) {
        this.userForm = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email]),
            role: new FormControl('member', Validators.required),
        });
        this.user = this.authService.user;
        if (!this.user) {
            console.error('User not found');
            return;
        }
    }

    addUserToProject() {
        this.errorMessage = '';
        this.successMessage = '';

        if (this.userForm.valid) {
            console.log('Form Data:', this.userForm.value);
            if (!this.user) {
                console.error('User not found');
                this.errorMessage =
                    'Vous devez être connecté pour ajouter un utilisateur à un projet';
                return;
            }
            console.log(this.userForm.value.role);
            const role = this.convertRoleToFrench(this.userForm.value.role);
            if (!this.isRoleAvailable(role)) {
                console.error('Invalid role:', role);
                this.errorMessage = 'Rôle invalide';
                return;
            }

            this.projectService
                .addUserToProject(
                    this.projectId,
                    this.userForm.value.email,
                    role,
                    this.user.id
                )
                .subscribe({
                    next: (response) => {
                        console.log('Response:', response);
                        this.successMessage = 'Utilisateur ajouté avec succès';

                        //clean the form and tell the parent component to refresh the list of users
                        this.userForm.reset();
                        this.refreshUsers.emit();
                    },
                    error: (error) => {
                        console.error('Error:', error);
                        this.errorMessage = error.message;
                    },
                });
        } else {
            console.error('Invalid form');
            this.errorMessage = 'Veuillez vérifier les informations saisies';
        }
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
