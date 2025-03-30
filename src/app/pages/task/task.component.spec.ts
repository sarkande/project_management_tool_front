import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskComponent } from './task.component';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { User } from '../../interfaces/user';
import { Task } from '../../interfaces/task';

describe('TaskComponent', () => {
    let component: TaskComponent;
    let fixture: ComponentFixture<TaskComponent>;
    let taskServiceMock: jasmine.SpyObj<TaskService>;
    let projectServiceMock: jasmine.SpyObj<ProjectService>;
    let authServiceMock: jasmine.SpyObj<AuthService>;

    beforeEach(async () => {
        taskServiceMock = jasmine.createSpyObj('TaskService', [
            'getTask',
            'updatePartialTask',
            'addUserToTask',
        ]);
        projectServiceMock = jasmine.createSpyObj('ProjectService', [
            'getUsersByProject',
        ]);
        authServiceMock = jasmine.createSpyObj('AuthService', [], {
            user: {
                id: 1,
                username: 'testuser',
                email: 'test@example.com',
            } as User,
        });

        await TestBed.configureTestingModule({
            imports: [TaskComponent, ReactiveFormsModule],
            providers: [
                { provide: TaskService, useValue: taskServiceMock },
                { provide: ProjectService, useValue: projectServiceMock },
                { provide: AuthService, useValue: authServiceMock },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            params: { id: '1', taskId: '1' },
                        },
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(TaskComponent);
        component = fixture.componentInstance;

        // Assurez-vous que les méthodes mockées retournent un Observable
        const mockTask: Task = {
            id: 1,
            name: 'Test Task',
            description: 'Description',
            priority: 1,
            status: 'pending',
            dueDate: new Date(),
            users: [],
        };
        taskServiceMock.getTask.and.returnValue(of(mockTask));
        projectServiceMock.getUsersByProject.and.returnValue(of([]));

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize task form on init', () => {
        expect(component.taskForm).toBeTruthy();
        expect(component.taskForm.value.name).toBe('Test Task');
    });

    it('should update task successfully', () => {
        const mockTask: Task = {
            id: 1,
            name: 'Test Task',
            description: 'Description',
            priority: 1,
            status: 'pending',
            dueDate: new Date(),
            users: [],
        };
        taskServiceMock.updatePartialTask.and.returnValue(of(undefined));
        component.initForm(mockTask);
        component.saveTask();
        expect(taskServiceMock.updatePartialTask).toHaveBeenCalled();
        expect(component.messages.success.task).toBe(
            'Tâche mise à jour avec succès.'
        );
    });

    it('should handle task update error', () => {
        taskServiceMock.updatePartialTask.and.returnValue(throwError('Error'));
        component.saveTask();
        expect(component.messages.errors.task).toBe(
            'Erreur lors de la mise à jour de la tâche.'
        );
    });

    it('should add user to task successfully', () => {
        const mockUser: User = {
            id: 2,
            username: 'user2',
            email: 'user2@example.com',
        };
        component.usersPool = [mockUser];
        component.task = {
            id: 1,
            name: 'Test Task',
            description: '',
            priority: 1,
            status: 'pending',
            dueDate: new Date(),
            users: [],
        };
        taskServiceMock.addUserToTask.and.returnValue(of(1));
        component.userForm.controls['email'].setValue('user2@example.com');
        component.addUserToTask();
        expect(taskServiceMock.addUserToTask).toHaveBeenCalled();
        expect(component.messages.success.user).toBe(
            'Utilisateur ajouté à la tâche avec succès.'
        );
    });

    it('should handle error when adding user to task', () => {
        const mockUser: User = {
            id: 2,
            username: 'user2',
            email: 'user2@example.com',
        };
        component.usersPool = [mockUser];
        component.task = {
            id: 1,
            name: 'Test Task',
            description: '',
            priority: 1,
            status: 'pending',
            dueDate: new Date(),
            users: [],
        };
        taskServiceMock.addUserToTask.and.returnValue(throwError('Error'));
        component.userForm.controls['email'].setValue('user2@example.com');
        component.addUserToTask();
        expect(component.messages.errors.user).toBe(
            "Erreur lors de l'ajout de l'utilisateur à la tâche."
        );
    });

    it('should not add user if user is not associated with the project', () => {
        const mockUser: User = {
            id: 2,
            username: 'user2',
            email: 'user2@example.com',
        };
        component.usersPool = [];
        component.userForm.controls['email'].setValue('user2@example.com');
        component.addUserToTask();
        expect(component.messages.errors.user).toBe(
            "L'utilisateur n'est pas associé au projet."
        );
    });

    it('should not add user if user is already associated with the task', () => {
        const mockUser: User = {
            id: 2,
            username: 'user2',
            email: 'user2@example.com',
        };
        component.usersPool = [mockUser];
        component.task = {
            id: 1,
            name: 'Test Task',
            description: '',
            priority: 1,
            status: 'pending',
            dueDate: new Date(),
            users: [mockUser],
        };
        component.userForm.controls['email'].setValue('user2@example.com');
        component.addUserToTask();
        expect(component.messages.errors.user).toBe(
            "L'utilisateur est déjà associé à la tâche."
        );
    });
});
