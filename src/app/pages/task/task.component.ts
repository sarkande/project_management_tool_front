import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    FormGroup,
    FormControl,
    Validators,
    ReactiveFormsModule,
} from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../interfaces/task';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StarRatingComponent } from '../../components/star-rating/star-rating.component';
import { ProjectService } from '../../services/project.service';
import { User } from '../../interfaces/user';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-task',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        StarRatingComponent,
    ],
    templateUrl: './task.component.html',
    styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit {
    taskForm!: FormGroup;
    userForm!: FormGroup;
    task!: Task;
    projectId!: number;
    taskId!: number;
    usersPool!: User[];
    currentUserRole = '';

    // Messages d'erreur et de succès
    messages = {
        errors: {
            task: '',
            user: '',
        },
        success: {
            task: '',
            user: '',
        },
    };

    constructor(
        private route: ActivatedRoute,
        private taskService: TaskService,
        private projectService: ProjectService,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
        this.projectId = this.route.snapshot.params['id'];
        this.taskId = this.route.snapshot.params['taskId'];

        if (this.projectId && this.taskId) {
            this.taskService.getTask(this.projectId, this.taskId).subscribe({
                next: (task) => {
                    this.task = task;
                    this.initForm(task);
                },
                error: (error) => {
                    console.error('Error:', error);
                },
            });
        }
        this.userForm = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email]),
        });
    }

    initForm(task: Task) {
        const formattedDate = task.dueDate
            ? this.formatDate(task.dueDate)
            : null;

        this.taskForm = new FormGroup({
            name: new FormControl(task.name, Validators.required),
            description: new FormControl(task.description),
            status: new FormControl(task.status, Validators.required),
            dueDate: new FormControl(formattedDate),
            priority: new FormControl(task.priority, Validators.required),
        });

        this.projectService.getUsersByProject(this.projectId).subscribe({
            next: (users) => {
                this.usersPool = users;
                const currentUser = this.authService.user;

                this.currentUserRole = users.find(
                    (user: User) => user.id === currentUser!.id
                )?.role;
            },
            error: (error) => {
                console.error('Error:', error);
            },
        });
    }

    saveTask() {
        // Reset messages
        this.messages.errors.task = '';
        this.messages.success.task = '';

        // On verifie si le formulaire est valide
        if (this.taskForm.valid) {
            const updatedTask = {
                ...this.taskForm.value,
            };
            this.taskService
                .updatePartialTask(this.projectId, this.taskId, updatedTask)
                .subscribe({
                    next: () => {
                        this.messages.success.task =
                            'Tâche mise à jour avec succès.';
                        this.refreshTask();
                    },
                    error: (error) => {
                        this.messages.errors.task =
                            'Erreur lors de la mise à jour de la tâche.';
                    },
                });
        } else {
            this.messages.errors.task =
                'Veuillez remplir tous les champs obligatoires.';
        }
    }

    addUserToTask() {
        // Reset messages
        this.messages.errors.user = '';
        this.messages.success.user = '';

        if (this.userForm.valid) {
            const userEmail = this.userForm.value.email;

            // On verifie si l'utilisateur est dans la pool d"users associés au projet
            const user = this.usersPool.find((u) => u.email === userEmail);
            if (!user) {
                this.messages.errors.user =
                    "L'utilisateur n'est pas associé au projet.";
                return;
            }

            // On verifie si l'utilisateur est déjà associé à la tâche
            if (
                this.task.users &&
                this.task.users.find((u) => u.id === user.id)
            ) {
                this.messages.errors.user =
                    "L'utilisateur est déjà associé à la tâche.";
                return;
            }

            // On ajoute l'utilisateur à la tâche
            this.taskService
                .addUserToTask(this.projectId, this.taskId, userEmail)
                .subscribe({
                    next: () => {
                        this.messages.success.user =
                            'Utilisateur ajouté à la tâche avec succès.';
                        this.refreshTask();
                    },
                    error: () => {
                        this.messages.errors.user =
                            "Erreur lors de l'ajout de l'utilisateur à la tâche.";
                    },
                });
        }
    }

    refreshTask() {
        this.taskService.getTask(this.projectId, this.taskId).subscribe({
            next: (task) => {
                this.task = task;
                this.initForm(task);
            },
            error: (error) => {
                console.error('Error:', error);
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

    formatDate(date: Date): string {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = `0${d.getMonth() + 1}`.slice(-2);
        const day = `0${d.getDate()}`.slice(-2);
        return `${year}-${month}-${day}`;
    }
}
