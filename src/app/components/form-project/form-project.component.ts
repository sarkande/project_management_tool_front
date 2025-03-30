import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
    FormGroup,
    FormControl,
    Validators,
    ReactiveFormsModule,
} from '@angular/forms';
import { ProjectForm } from '../../interfaces/project-form';

@Component({
    selector: 'app-form-project',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './form-project.component.html',
    styleUrls: ['./form-project.component.scss'],
})
export class FormProjectComponent {
    @Output() onSubmit = new EventEmitter<any>();

    projectForm = new FormGroup({
        name: new FormControl('', [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
        ]),
        start_date: new FormControl(''),
        description: new FormControl(''),
    });

    createProject() {
        if (this.projectForm.valid) {
            const project: ProjectForm = {
                name: this.projectForm.value.name as string,
                startDate: this.projectForm.value.start_date as string,
                description: this.projectForm.value.description as string,
            };

            this.onSubmit.emit(project);
        } else {
            console.error('Form is not valid', this.projectForm.errors);
        }
    }
}
