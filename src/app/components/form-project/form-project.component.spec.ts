import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormProjectComponent } from './form-project.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('FormProjectComponent', () => {
    let component: FormProjectComponent;
    let fixture: ComponentFixture<FormProjectComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FormProjectComponent, ReactiveFormsModule],
        }).compileComponents();

        fixture = TestBed.createComponent(FormProjectComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should emit onSubmit with project data when form is valid', () => {
        spyOn(component.onSubmit, 'emit');

        component.projectForm.controls['name'].setValue('Test Project');
        component.projectForm.controls['start_date'].setValue('2023-01-01');
        component.projectForm.controls['description'].setValue(
            'Description of the project'
        );

        component.createProject();

        expect(component.onSubmit.emit).toHaveBeenCalledWith({
            name: 'Test Project',
            startDate: '2023-01-01',
            description: 'Description of the project',
        });
    });

    it('should not emit onSubmit if form is invalid', () => {
        spyOn(console, 'error');
        spyOn(component.onSubmit, 'emit');

        component.projectForm.controls['name'].setValue(''); // Invalid name
        component.createProject();

        expect(console.error).toHaveBeenCalledWith(
            'Form is not valid',
            component.projectForm.errors
        );
        expect(component.onSubmit.emit).not.toHaveBeenCalled();
    });

    it('should validate name field correctly', () => {
        const nameControl = component.projectForm.controls['name'];

        nameControl.setValue('');
        expect(nameControl.valid).toBeFalse();
        expect(nameControl.errors?.['required']).toBeTrue();

        nameControl.setValue('Te');
        expect(nameControl.valid).toBeFalse();
        expect(nameControl.errors?.['minlength']).toBeTruthy();

        nameControl.setValue('Valid Project Name');
        expect(nameControl.valid).toBeTrue();
        expect(nameControl.errors).toBeNull();
    });
});
