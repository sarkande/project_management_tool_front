import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-form-manage-user-project',
    standalone: true,
    imports: [],
    templateUrl: './form-manage-user-project.component.html',
    styleUrl: './form-manage-user-project.component.scss',
})
export class FormManageUserProjectComponent {
    @Output() projectId = new EventEmitter<number>();
}
