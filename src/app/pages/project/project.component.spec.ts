import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectComponent } from './project.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';
import { TaskService } from '../../services/task.service';
import { of } from 'rxjs';
import { User } from '../../interfaces/user';
import { Task } from '../../interfaces/task';
import { Project } from '../../interfaces/project';

describe('ProjectComponent', () => {
    let component: ProjectComponent;
    let fixture: ComponentFixture<ProjectComponent>;
    let projectServiceSpy: jasmine.SpyObj<ProjectService>;
    let authServiceSpy: jasmine.SpyObj<AuthService>;
    let taskServiceSpy: jasmine.SpyObj<TaskService>;
    let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;

    beforeEach(async () => {
        activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
            snapshot: { params: { id: 1 } },
        });

        console.log('ActivatedRoute mock:', activatedRouteSpy.snapshot.params); // Vérification du mock

        projectServiceSpy = jasmine.createSpyObj('ProjectService', [
            'getProject',
            'getUsersByProject',
        ]);
        authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn'], {
            user: {
                id: 1,
                username: 'testUser',
                email: 'test@example.com',
            } as User,
        });
        taskServiceSpy = jasmine.createSpyObj('TaskService', ['getTasks']);

        await TestBed.configureTestingModule({
            imports: [ProjectComponent],
            providers: [
                provideHttpClientTesting(),
                provideRouter([]),
                { provide: ProjectService, useValue: projectServiceSpy },
                { provide: AuthService, useValue: authServiceSpy },
                { provide: ActivatedRoute, useValue: activatedRouteSpy },
                { provide: TaskService, useValue: taskServiceSpy },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ProjectComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    describe('ngOnInit', () => {
        it('should not proceed if no project ID in route', () => {
            component.ngOnInit();
            expect(projectServiceSpy.getProject).not.toHaveBeenCalled();
        });
    });

    describe('User Role Checks', () => {
        it('should return true for isUserAdmin if role is Administrateur', () => {
            component.currentUserRole = 'Administrateur';
            expect(component.isUserAdmin).toBeTrue();
        });
        it('should return true for isUserMember if role is Membre', () => {
            component.currentUserRole = 'Membre';
            expect(component.isUserMember).toBeTrue();
        });
        it('should return true for isUserWatcher if role is Observateur', () => {
            component.currentUserRole = 'Observateur';
            expect(component.isUserWatcher).toBeTrue();
        });
    });

    describe('Task Handling', () => {
        it('should toggle task form visibility', () => {
            expect(component.isOpenCreateTaskForm).toBeFalse();
            component.handleOpenCreateTaskForm();
            expect(component.isOpenCreateTaskForm).toBeTrue();
        });
    });

    describe('handleRefreshTasks', () => {
        it('should refresh tasks and close the create task form', () => {
            const mockTasks: Task[] = [
                {
                    id: 1,
                    name: 'Task 1',
                    description: 'Description 1',
                    priority: 1,
                    status: 'To Do',
                },
                {
                    id: 2,
                    name: 'Task 2',
                    description: 'Description 2',
                    priority: 1,
                    status: 'In Progress',
                },
            ];
            taskServiceSpy.getTasks.and.returnValue(of(mockTasks));
            component.project = { id: 1, name: 'Test Project' } as Project;

            component.isOpenCreateTaskForm = true; // Ensure the form is initially open
            component.handleRefreshTasks();

            expect(component.isOpenCreateTaskForm).toBeFalse();
            expect(taskServiceSpy.getTasks).toHaveBeenCalledWith(1);
            expect(component.tasks).toEqual(mockTasks);
        });
       
    });

    describe('handleRefreshUsers', () => {
        it('should refresh the list of users for the project', () => {
            const mockUsers: User[] = [
                { id: 1, username: 'User 1', email: 'user1@example.com', role: 'Membre' },
                { id: 2, username: 'User 2', email: 'user2@example.com', role: 'Administrateur' },
            ];
            projectServiceSpy.getUsersByProject.and.returnValue(of(mockUsers));
            component.project = { id: 1, name: 'Test Project' } as Project;

            component.handleRefreshUsers();

            expect(projectServiceSpy.getUsersByProject).toHaveBeenCalledWith(1);
            expect(component.users).toEqual(mockUsers);
        });
    });

    describe('handleOpenTask', () => {
        it('should navigate to the correct task route if project and task are valid', () => {
            const mockTask: Task = { id: 1, name: 'Task 1', description: '', priority: 1, status: 'To Do' };
            component.project = { id: 1, name: 'Test Project' } as Project;

            const routerSpy = spyOn(component['router'], 'navigate');
            component.handleOpenTask(mockTask);

            expect(routerSpy).toHaveBeenCalledWith(['/project/1/task/1']);
        });

        it('should not navigate if project is null', () => {
            const mockTask: Task = { id: 1, name: 'Task 1', description: '', priority: 1, status: 'To Do' };
            component.project = null;

            const routerSpy = spyOn(component['router'], 'navigate');
            component.handleOpenTask(mockTask);

            expect(routerSpy).not.toHaveBeenCalled();
        });

        it('should not navigate if task is null', () => {
            component.project = { id: 1, name: 'Test Project' } as Project;

            const routerSpy = spyOn(component['router'], 'navigate');
            component.handleOpenTask(null as unknown as Task);

            expect(routerSpy).not.toHaveBeenCalled();
        });
    });
    describe('loadProjects', () => {
        it('should load project data if project ID is provided', () => {
            const mockProject: Project = { id: 1, name: 'Test Project' } as Project;
            projectServiceSpy.getProject.and.returnValue(of(mockProject));

            component.loadProjects(1);

            expect(projectServiceSpy.getProject).toHaveBeenCalledWith(1);
            expect(component.project).toEqual(mockProject);
        });

  
    });
});
