import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormManageUserProjectComponent } from './form-manage-user-project.component';
import { AuthService } from '../../services/auth.service';
import { ProjectService } from '../../services/project.service';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { User } from '../../interfaces/user';

describe('FormManageUserProjectComponent', () => {
    let authServiceMock: jasmine.SpyObj<AuthService>;
    let projectServiceMock: jasmine.SpyObj<ProjectService>;
    let component: FormManageUserProjectComponent;

    beforeEach(() => {
        authServiceMock = jasmine.createSpyObj('AuthService', [], {
            user: {
                id: 1,
                username: 'testuser',
                email: 'test@example.com',
            } as User,
        });
        projectServiceMock = jasmine.createSpyObj('ProjectService', [
            'addUserToProject',
        ]);
    });

    describe('with user present', () => {
        let component: FormManageUserProjectComponent;
        let fixture: ComponentFixture<FormManageUserProjectComponent>;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [FormManageUserProjectComponent, ReactiveFormsModule],
                providers: [
                    { provide: AuthService, useValue: authServiceMock },
                    { provide: ProjectService, useValue: projectServiceMock },
                ],
            }).compileComponents();

            fixture = TestBed.createComponent(FormManageUserProjectComponent);
            component = fixture.componentInstance;
            component.projectId = 1;
            fixture.detectChanges();
        });

        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should not add user if role is invalid', () => {
            spyOn(component, 'convertRoleToFrench').and.returnValue(
                'InvalidRole'
            );
            spyOn(component, 'isRoleAvailable').and.returnValue(false);

            component.userForm.controls['email'].setValue('valid@example.com');
            component.userForm.controls['role'].setValue('invalidRole');
            component.addUserToProject();

            expect(component.errorMessage).toBe('Rôle invalide');
        });

        it('should handle error codes correctly', () => {
            projectServiceMock.addUserToProject.and.returnValue(
                throwError({ status: 401 })
            );
            component.userForm.controls['email'].setValue('valid@example.com');
            component.userForm.controls['role'].setValue('member');
            component.addUserToProject();
            expect(component.errorMessage).toBe(
                "L'utilisateur est déjà membre du projet"
            );

            projectServiceMock.addUserToProject.and.returnValue(
                throwError({ status: 404 })
            );
            component.addUserToProject();
            expect(component.errorMessage).toBe("L'utilisateur n'existe pas");

            projectServiceMock.addUserToProject.and.returnValue(
                throwError({ status: 500 })
            );
            component.addUserToProject();
            expect(component.errorMessage).toBe('Une erreur est survenue');
        });
    });

    describe('without user present', () => {
        let component: FormManageUserProjectComponent;
        let fixture: ComponentFixture<FormManageUserProjectComponent>;

        beforeEach(async () => {
            const localAuthServiceMock = jasmine.createSpyObj(
                'AuthService',
                [],
                { user: null }
            );

            await TestBed.configureTestingModule({
                imports: [FormManageUserProjectComponent, ReactiveFormsModule],
                providers: [
                    { provide: AuthService, useValue: localAuthServiceMock },
                    { provide: ProjectService, useValue: projectServiceMock },
                ],
            }).compileComponents();

            fixture = TestBed.createComponent(FormManageUserProjectComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });

        it('should handle absence of user in constructor', () => {
            expect(component.user).toBeNull();
            expect(component.errorMessage).toBe('');
        });

        it('should not add user if user is not available', () => {
            component.addUserToProject();
            expect(component.errorMessage).toBe(
                'Veuillez vérifier les informations saisies'
            );
        });
    });
    describe('isRoleAvailable', () => {
        let component: FormManageUserProjectComponent;

        beforeEach(() => {
            component = new FormManageUserProjectComponent(
                jasmine.createSpyObj('AuthService', [], { user: null }),
                jasmine.createSpyObj('ProjectService', ['addUserToProject'])
            );
        });

        it('should return true for valid roles', () => {
            expect(component.isRoleAvailable('Administrateur')).toBeTrue();
            expect(component.isRoleAvailable('Membre')).toBeTrue();
            expect(component.isRoleAvailable('Observateur')).toBeTrue();
        });

        it('should return false for invalid roles', () => {
            expect(component.isRoleAvailable('Inconnu')).toBeFalse();
            expect(component.isRoleAvailable('')).toBeFalse();
            expect(component.isRoleAvailable('admin')).toBeFalse();
        });
    });

    describe('convertRoleToFrench', () => {
        let component: FormManageUserProjectComponent;

        beforeEach(() => {
            component = new FormManageUserProjectComponent(
                jasmine.createSpyObj('AuthService', [], { user: null }),
                jasmine.createSpyObj('ProjectService', ['addUserToProject'])
            );
        });

        it('should convert roles to French correctly', () => {
            expect(component.convertRoleToFrench('admin')).toBe(
                'Administrateur'
            );
            expect(component.convertRoleToFrench('member')).toBe('Membre');
            expect(component.convertRoleToFrench('watcher')).toBe(
                'Observateur'
            );
        });

        it('should return "Inconnu" for unknown roles', () => {
            expect(component.convertRoleToFrench('unknown')).toBe('Inconnu');
            expect(component.convertRoleToFrench('')).toBe('Inconnu');
            expect(component.convertRoleToFrench('random')).toBe('Inconnu');
        });
    });

    describe('FormManageUserProjectComponent - addUserToProject', () => {
        let component: FormManageUserProjectComponent;
        let fixture: ComponentFixture<FormManageUserProjectComponent>;
        let authServiceMock: jasmine.SpyObj<AuthService>;
        let projectServiceMock: jasmine.SpyObj<ProjectService>;

        beforeEach(async () => {
            authServiceMock = jasmine.createSpyObj('AuthService', [], {
                user: null,
            }); // Simulate absence of user
            projectServiceMock = jasmine.createSpyObj('ProjectService', [
                'addUserToProject',
            ]);

            await TestBed.configureTestingModule({
                imports: [FormManageUserProjectComponent, ReactiveFormsModule],
                providers: [
                    { provide: AuthService, useValue: authServiceMock },
                    { provide: ProjectService, useValue: projectServiceMock },
                ],
            }).compileComponents();

            fixture = TestBed.createComponent(FormManageUserProjectComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });

        it('should set error message if user is not available', () => {
            component.userForm.controls['email'].setValue('valid@example.com');
            component.userForm.controls['role'].setValue('member');
            component.addUserToProject();

            expect(component.errorMessage).toBe(
                'Vous devez être connecté pour ajouter un utilisateur à un projet'
            );
            expect(component.successMessage).toBe('');
        });
    });
});
