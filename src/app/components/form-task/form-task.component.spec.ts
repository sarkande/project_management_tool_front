import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormTaskComponent } from './form-task.component';
import { TaskService } from '../../services/task.service';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { Task } from '../../interfaces/task';

describe('FormTaskComponent', () => {
    let component: FormTaskComponent;
    let fixture: ComponentFixture<FormTaskComponent>;
    let taskServiceMock: jasmine.SpyObj<TaskService>;

    beforeEach(async () => {
        taskServiceMock = jasmine.createSpyObj('TaskService', ['postTask']);

        await TestBed.configureTestingModule({
            imports: [
                FormTaskComponent,
                ReactiveFormsModule,
                StarRatingComponent,
            ],
            providers: [{ provide: TaskService, useValue: taskServiceMock }],
        }).compileComponents();

        fixture = TestBed.createComponent(FormTaskComponent);
        component = fixture.componentInstance;
        component.projectId = 1; // Set a projectId for testing
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should return default priority value', () => {
        expect(component.priorityValue).toBe(1);
    });

    it('should not submit if form is invalid', () => {
        spyOn(console, 'error');
        component.taskForm.controls['name'].setValue('');
        component.onSubmit();
        expect(console.error).toHaveBeenCalledWith('Form is not valid');
    });



    it('should not submit if status is missing', () => {
        spyOn(console, 'error');
        component.taskForm.controls['name'].setValue('Test Task');
        component.taskForm.controls['priority'].setValue(3);
        component.taskForm.controls['status'].setValue('');
        component.onSubmit();
        expect(console.error).toHaveBeenCalledWith('Status is required');
    });

 

    it('should handle error on task submission', () => {
        spyOn(console, 'error');
        taskServiceMock.postTask.and.returnValue(
            throwError('Error creating task')
        );

        component.taskForm.controls['name'].setValue('Test Task');
        component.taskForm.controls['priority'].setValue(3);
        component.taskForm.controls['status'].setValue('in-progress');
        component.onSubmit();

        expect(console.error).toHaveBeenCalledWith(
            'Error creating task:',
            'Error creating task'
        );
    });
});
