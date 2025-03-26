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
    originalTask!: Task;
    projectId!: number;
    taskId!: number;
    usersPool!: User[];

    constructor(
        private route: ActivatedRoute,
        private taskService: TaskService,
        private projectService: ProjectService
    ) {}

    ngOnInit(): void {
        this.projectId = this.route.snapshot.params['id'];
        this.taskId = this.route.snapshot.params['taskId'];

        if (this.projectId && this.taskId) {
            this.taskService.getTask(this.projectId, this.taskId).subscribe({
                next: (task) => {
                    this.task = task;
                    this.originalTask = { ...task };
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
        this.taskForm = new FormGroup({
            name: new FormControl(task.name, Validators.required),
            description: new FormControl(task.description),
            status: new FormControl(task.status, Validators.required),
            dueDate: new FormControl(
                new Date(task.dueDate ?? ''),
                Validators.required
            ),
            priority: new FormControl(task.priority, Validators.required),
        });

        this.taskForm.valueChanges.subscribe(() => {});

        this.projectService.getUsersByProject(this.projectId).subscribe({
            next: (users) => {
                this.usersPool = users;
            },
            error: (error) => {
                console.error('Error:', error);
            },
        });
    }

    saveTask() {
        if (this.taskForm.valid) {
            const updatedTask = {
                ...this.originalTask,
                ...this.taskForm.value,
            };
            this.taskService
                .updatePartialTask(this.projectId, this.taskId, updatedTask)
                .subscribe({
                    next: () => {
                        console.log('Task updated successfully');
                        this.refreshTask();
                    },
                    error: (error) => {
                        console.error('Error updating task:', error);
                    },
                });
        }
    }

    addUserToTask() {
        if (this.userForm.valid) {
            const userEmail = this.userForm.value.email;
            console.log('Adding user with email:', userEmail);
        
            // On verifie si l'utilisateur est dans la pool d"users associés au projet
            const user = this.usersPool.find((u) => u.email === userEmail);
            if (!user) {
                console.error('User not found in the pool');
                return;
            }

            // On verifie si l'utilisateur est déjà associé à la tâche
            if (this.task.users && this.task.users.find((u) => u.id === user.id)) {
                console.error('User already assigned to task');
                return;
            }

            // On ajoute l'utilisateur à la tâche
            this.taskService
                .addUserToTask(this.projectId, this.taskId, userEmail)
                .subscribe({
                    next: () => {
                        console.log('User added to task');
                        this.refreshTask();
                    },
                    error: () => {
                        console.error('Error adding user to task:');
                    },
                });
        }
    }

    refreshTask(){
        this.taskService.getTask(this.projectId, this.taskId).subscribe({
            next: (task) => {
                this.task = task;
                this.originalTask = { ...task };
                this.initForm(task);
            },
            error: (error) => {
                console.error('Error:', error);
            },
        });
    }
}
