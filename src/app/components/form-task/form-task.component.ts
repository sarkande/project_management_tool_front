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
        } else {
            console.error('Form is not valid');
        }
    }
}
