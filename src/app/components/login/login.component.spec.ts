import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { UserAuthResponse } from '../../interfaces/user-auth-response'; // Assurez-vous que l'interface est importée

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let authServiceMock: jasmine.SpyObj<AuthService>;
    let routerMock: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        authServiceMock = jasmine.createSpyObj('AuthService', ['login']);
        routerMock = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [LoginComponent, ReactiveFormsModule],
            providers: [
                { provide: AuthService, useValue: authServiceMock },
                { provide: Router, useValue: routerMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should not submit if form is invalid', () => {
        spyOn(console, 'error');
        component.loginForm.controls['email'].setValue('');
        component.loginForm.controls['password'].setValue('');
        component.onSubmit();
        expect(authServiceMock.login).not.toHaveBeenCalled();
    });

    it('should submit if form is valid and navigate on success', () => {
        const mockUser: UserAuthResponse = {
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
        };
        authServiceMock.login.and.returnValue(of(mockUser)); // Simulate successful login

        component.loginForm.controls['email'].setValue('test@example.com');
        component.loginForm.controls['password'].setValue('password123');
        component.onSubmit();

        expect(authServiceMock.login).toHaveBeenCalledWith({
            email: 'test@example.com',
            password: 'password123',
        });
        expect(routerMock.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('should handle server unreachable error', () => {
        authServiceMock.login.and.returnValue(throwError({ status: 0 }));
        component.loginForm.controls['email'].setValue('test@example.com');
        component.loginForm.controls['password'].setValue('password123');
        component.onSubmit();

        expect(component.error).toBe('Serveur injoignable');
    });

    it('should handle incorrect credentials error', () => {
        authServiceMock.login.and.returnValue(throwError({ status: 401 }));
        component.loginForm.controls['email'].setValue('test@example.com');
        component.loginForm.controls['password'].setValue('password123');
        component.onSubmit();

        expect(component.error).toBe('Email ou mot de passe incorrect');
    });

    it('should handle internal server error', () => {
        authServiceMock.login.and.returnValue(throwError({ status: 500 }));
        component.loginForm.controls['email'].setValue('test@example.com');
        component.loginForm.controls['password'].setValue('password123');
        component.onSubmit();

        expect(component.error).toBe('Erreur interne du serveur');
    });
});
