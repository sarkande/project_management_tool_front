import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectListComponent } from './project-list.component';
import { ProjectService } from '../../services/project.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ProjectWithRole } from '../../interfaces/project-with-role';
import { User } from '../../interfaces/user';

describe('ProjectListComponent', () => {
    let component: ProjectListComponent;
    let fixture: ComponentFixture<ProjectListComponent>;
    let projectServiceMock: jasmine.SpyObj<ProjectService>;
    let userServiceMock: jasmine.SpyObj<UserService>;
    let authServiceMock: jasmine.SpyObj<AuthService>;
    let routerMock: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        projectServiceMock = jasmine.createSpyObj('ProjectService', [
            'createProject',
        ]);
        userServiceMock = jasmine.createSpyObj('UserService', ['getProjects']);
        authServiceMock = jasmine.createSpyObj(
            'AuthService',
            ['isLoggedIn', 'logout'],
            {
                user: {
                    id: 1,
                    username: 'testuser',
                    email: 'test@example.com',
                } as User,
            }
        );
        routerMock = jasmine.createSpyObj('Router', ['navigate']);

        authServiceMock.isLoggedIn.and.returnValue(true);

        await TestBed.configureTestingModule({
            imports: [ProjectListComponent],
            providers: [
                { provide: ProjectService, useValue: projectServiceMock },
                { provide: UserService, useValue: userServiceMock },
                { provide: AuthService, useValue: authServiceMock },
                { provide: Router, useValue: routerMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ProjectListComponent);
        component = fixture.componentInstance;

        // Mock pour le retour des projets
        userServiceMock.getProjects.and.returnValue(of([]));

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize projects on init', () => {
        component.ngOnInit();
        expect(component.projects).toEqual([]);
        expect(authServiceMock.isLoggedIn).toHaveBeenCalled();
    });

    it('should logout if user is not logged in', () => {
        authServiceMock.isLoggedIn.and.returnValue(false);
        component.ngOnInit();
        expect(authServiceMock.logout).toHaveBeenCalled();
    });

    it('should toggle create project form', () => {
        component.toggleCreateProjectForm();
        expect(component.isOpenCreateProjectForm).toBeTrue();
        component.toggleCreateProjectForm();
        expect(component.isOpenCreateProjectForm).toBeFalse();
    });

    it('should create project successfully', () => {
        const mockProject = {
            id: 1,
            name: 'New Project',
            description: 'Description',
        };
        projectServiceMock.createProject.and.returnValue(of(1));

        component.createProject(mockProject);
        expect(projectServiceMock.createProject).toHaveBeenCalledWith(
            mockProject,
            component.user!.id
        );
        expect(component.projects.length).toBe(1);
        expect(component.successMessage).toBe('Projet créé avec succès');
    });

    it('should handle error when creating project', () => {
        const mockProject = {
            id: 1,
            name: 'New Project',
            description: 'Description',
        };
        projectServiceMock.createProject.and.returnValue(
            throwError({ status: 500 })
        );

        component.createProject(mockProject);
        expect(component.errorMessage).toBe('Erreur interne du serveur');
    });

    it('should navigate to project', () => {
        component.navigateToProject(1);
        expect(routerMock.navigate).toHaveBeenCalledWith(['/project', 1]);
    });

    it('should navigate to dashboard', () => {
        component.navigateToDashboard();
        expect(routerMock.navigate).toHaveBeenCalledWith(['/dashboard']);
    });
});
