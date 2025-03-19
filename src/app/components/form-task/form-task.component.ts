import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
    FormGroup,
    FormControl,
    Validators,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { TaskService } from '../../services/task.service';
import { Task } from '../../interfaces/task';

@Component({
    selector: 'app-form-task',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        StarRatingComponent,
    ],
    templateUrl: './form-task.component.html',
    styleUrls: ['./form-task.component.scss'],
})
export class FormTaskComponent {
    @Input() projectId!: number;

    constructor(private taskService: TaskService) {}

    //Getter pour eviter les problemes de compilation avec un priorité null
    get priorityValue(): number {
        return this.taskForm.get('priority')?.value ?? 1;
    }

    taskForm = new FormGroup({
        name: new FormControl('', [
            Validators.required,
            Validators.maxLength(50),
        ]),
        description: new FormControl(''),
        priority: new FormControl(1, [
            Validators.required,
            Validators.min(1),
            Validators.max(5),
        ]),
        dueDate: new FormControl(''),
        status: new FormControl('pending'),
    });

    onSubmit() {
        if (this.taskForm.valid) {
            console.log('Form Submitted!', this.taskForm.value);
            let name = this.taskForm.value.name;
            let description = this.taskForm.value.description;
            let priority = this.taskForm.value.priority;
            let dueDate = this.taskForm.value.dueDate;
            let status = this.taskForm.value.status;

            if (name == null || name == '') {
                console.error('Name is required');
                return;
            }

            if (priority == null) {
                console.error('Priority is required');
                return;
            }

            if (status == null || status == '') {
                console.error('Status is required');
                return;
            }

            const data: Task = {
                name: name,
                priority: priority,
                status: status,
            };

            data.description = description ?? '';
            if (dueDate != null && dueDate != '')
                data.dueDate = new Date(dueDate);

            console.log('Data sent:', data);

            this.taskService.postTask(this.projectId, data).subscribe(
                (task) => {
                    console.log('Task created', task);
                    this.taskForm.reset();
                },
                (error) => {
                    console.error('Error creating task:', error);
                }
            );
        } else {
            console.error('Form is not valid');
        }
    }
}
