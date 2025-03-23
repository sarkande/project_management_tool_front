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
    task!: Task;
    originalTask!: Task;
    projectId!: number;
    taskId!: number;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private taskService: TaskService
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

        this.taskForm.valueChanges.subscribe(() => {
        });
    }

    saveTask() {
        if (this.taskForm.valid && this.taskForm.dirty) {
            const updatedTask = {
                ...this.originalTask,
                ...this.taskForm.value,
            };
            this.taskService
                .updatePartialTask(this.projectId, this.taskId, updatedTask)
                .subscribe({
                    next: () => {
                        console.log('Task updated successfully');
                    },
                    error: (error) => {
                        console.error('Error updating task:', error);
                    },
                });
        }
    }
}
