import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { of, throwError } from 'rxjs';
import { User } from '../../interfaces/user'; // Assurez-vous que l'interface User est importée

describe('RegisterComponent', () => {
    let component: RegisterComponent;
    let fixture: ComponentFixture<RegisterComponent>;
    let userServiceMock: jasmine.SpyObj<UserService>;

    beforeEach(async () => {
        userServiceMock = jasmine.createSpyObj('UserService', ['register']);

        await TestBed.configureTestingModule({
            imports: [RegisterComponent, ReactiveFormsModule],
            providers: [{ provide: UserService, useValue: userServiceMock }],
        }).compileComponents();

        fixture = TestBed.createComponent(RegisterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should not submit if form is invalid', () => {
        component.registerForm.controls['username'].setValue('');
        component.registerForm.controls['email'].setValue('');
        component.registerForm.controls['password'].setValue('');
        component.registerForm.controls['confirmPassword'].setValue('');
        component.onSubmit();
        expect(userServiceMock.register).not.toHaveBeenCalled();
    });

    it('should submit if form is valid and show success message', () => {
        const mockUser: User = {
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
            role: 'user', // Ajoutez d'autres propriétés nécessaires ici
        };
        userServiceMock.register.and.returnValue(of(mockUser)); // Simulate successful registration

        component.registerForm.controls['username'].setValue('testuser');
        component.registerForm.controls['email'].setValue('test@example.com');
        component.registerForm.controls['password'].setValue('password123');
        component.registerForm.controls['confirmPassword'].setValue(
            'password123'
        );
        component.onSubmit();

        expect(userServiceMock.register).toHaveBeenCalledWith({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
        });
        expect(component.serverSuccess).toBe('Inscription réussie');
        expect(component.serverError).toBe('');
    });

    it('should handle email already used error', () => {
        userServiceMock.register.and.returnValue(throwError({ status: 409 }));

        component.registerForm.controls['username'].setValue('testuser');
        component.registerForm.controls['email'].setValue('test@example.com');
        component.registerForm.controls['password'].setValue('password123');
        component.registerForm.controls['confirmPassword'].setValue(
            'password123'
        );
        component.onSubmit();

        expect(component.serverError).toBe('Cet email est déjà utilisé');
        expect(component.serverSuccess).toBe('');
    });

    it('should handle server unreachable error', () => {
        userServiceMock.register.and.returnValue(throwError({ status: 0 }));

        component.registerForm.controls['username'].setValue('testuser');
        component.registerForm.controls['email'].setValue('test@example.com');
        component.registerForm.controls['password'].setValue('password123');
        component.registerForm.controls['confirmPassword'].setValue(
            'password123'
        );
        component.onSubmit();

        expect(component.serverError).toBe(
            'Impossible de se connecter au serveur'
        );
        expect(component.serverSuccess).toBe('');
    });

    it('should handle unexpected error', () => {
        userServiceMock.register.and.returnValue(throwError({ status: 500 }));

        component.registerForm.controls['username'].setValue('testuser');
        component.registerForm.controls['email'].setValue('test@example.com');
        component.registerForm.controls['password'].setValue('password123');
        component.registerForm.controls['confirmPassword'].setValue(
            'password123'
        );
        component.onSubmit();

        expect(component.serverError).toBe(
            'Une erreur inattendue est survenue'
        );
        expect(component.serverSuccess).toBe('');
    });
});
