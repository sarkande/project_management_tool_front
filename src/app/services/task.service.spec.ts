import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';
import { ApiService } from './api.service';
import { Task } from '../interfaces/task';
import { User } from '../interfaces/user';
import { Comment } from '../interfaces/comment';
import { of, throwError } from 'rxjs';
import { TaskForm } from '../interfaces/task-form';

describe('TaskService', () => {
    let service: TaskService;
    let mockApiService: jasmine.SpyObj<ApiService>;

    // Données de test
    const mockUser: User = {
        id: 1,
        username: 'johndoe',
        email: 'john@iscod.fr',
        role: 'DEV',
    };

    const mockComment: Comment = {
        id: 1,
        content: 'Commentaire important',
        createdAt: new Date('2025-03-30T10:00:00'),
        createdBy: 'john@iscod.fr',
    };

    const mockTask: Task = {
        id: 1,
        name: 'Migration Angular',
        priority: 2,
        status: 'IN_PROGRESS',
        description: 'Mettre à jour vers Angular 18',
        users: [mockUser],
        comments: [mockComment],
    };

    const mockTaskForm: TaskForm = {
        name: 'Nouveau composant',
        priority: 1,
        status: 'TODO',
        users: [mockUser],
    };

    beforeEach(() => {
        mockApiService = jasmine.createSpyObj('ApiService', [
            'get',
            'post',
            'put',
            'patch',
        ]);

        TestBed.configureTestingModule({
            providers: [
                TaskService,
                { provide: ApiService, useValue: mockApiService },
            ],
        });

        service = TestBed.inject(TaskService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getTasks', () => {
        it('should return tasks with users and comments', (done) => {
            const projectId = 1;
            mockApiService.get.and.returnValue(of([mockTask]));

            service.getTasks(projectId).subscribe((tasks) => {
                expect(tasks[0].users?.[0].username).toBe('johndoe');
                expect(tasks[0].comments?.[0].createdBy).toContain('@iscod.fr');
                done();
            });
        });
    });

    describe('postTask', () => {
        it('should handle TaskForm with users', () => {
            const projectId = 2;
            mockApiService.post.and.returnValue(of(mockTask));

            service.postTask(projectId, mockTaskForm).subscribe((task) => {
                expect(task.users?.[0].role).toBe('DEV');
            });
        });
    });

    describe('getTask', () => {
        it('should parse comment dates correctly', (done) => {
            mockApiService.get.and.returnValue(of(mockTask));

            service.getTask(1, 1).subscribe((task) => {
                expect(task.comments?.[0].createdAt instanceof Date).toBeTrue();
                expect(task.comments?.[0].createdBy).toBe('john@iscod.fr');
                done();
            });
        });
    });

    describe('updatePartialTask', () => {
        it('should handle user assignments', () => {
            const update: TaskForm = {
                ...mockTaskForm,
                users: [{ ...mockUser, role: 'LEAD' }],
            };

            mockApiService.patch.and.returnValue(of(void 0));

            service.updatePartialTask(1, 1, update).subscribe();

            expect(mockApiService.patch).toHaveBeenCalledWith(
                '/project/1/task/1',
                jasmine.objectContaining({
                    users: jasmine.arrayContaining([
                        jasmine.objectContaining({ username: 'johndoe' }),
                    ]),
                })
            );
        });
    });

    describe('Comment validation', () => {
        it('should handle comments with valid createdBy', (done) => {
            const validComment: Comment = {
                id: 2,
                content: 'Commentaire valide',
                createdAt: new Date(),
                createdBy: 'admin@iscod.fr',
            };

            mockApiService.get.and.returnValue(
                of({
                    ...mockTask,
                    comments: [validComment],
                })
            );

            service.getTask(1, 3).subscribe((task) => {
                expect(task.comments?.[0].createdBy).toMatch(/@iscod\.fr$/);
                done();
            });
        });

        it('should handle missing createdBy gracefully', (done) => {
            const invalidComment = {
                id: 3,
                content: 'Commentaire sans email',
                createdAt: new Date(),
            };

            mockApiService.get.and.returnValue(
                of({
                    ...mockTask,
                    comments: [invalidComment],
                })
            );

            service.getTask(1, 4).subscribe((task) => {
                expect(task.comments?.[0].createdBy).toBeUndefined();
                done();
            });
        });
    });

    describe('Error handling', () => {
        it('should handle API errors', (done) => {
            const errorResponse = new Error('API error');
            mockApiService.get.and.returnValue(throwError(() => errorResponse));

            service.getTask(999, 999).subscribe({
                error: (err) => {
                    expect(err.message).toBe('API error');
                    done();
                },
            });
        });
    });
});
