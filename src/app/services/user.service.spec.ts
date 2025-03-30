import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { ApiService } from './api.service';
import { of } from 'rxjs';
import { UserRegister } from '../interfaces/user-register';
import { User } from '../interfaces/user';
import { UserAuthLogin } from '../interfaces/user-auth-login';
import { ProjectWithRole } from '../interfaces/project-with-role';
import { Task } from '../interfaces/task';

describe('UserService', () => {
    let service: UserService;
    let mockApiService: jasmine.SpyObj<ApiService>;

    beforeEach(() => {
        const apiSpy = jasmine.createSpyObj('ApiService', ['post', 'get']);

        TestBed.configureTestingModule({
            providers: [UserService, { provide: ApiService, useValue: apiSpy }],
        });

        service = TestBed.inject(UserService);
        mockApiService = TestBed.inject(
            ApiService
        ) as jasmine.SpyObj<ApiService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('register', () => {
        it('should call ApiService.post with correct URL and user data', () => {
            const user: UserRegister = {
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123',
            };
            const mockUser: User = {
                id: 1,
                username: 'testuser',
                email: 'test@example.com',
                role: 'user',
            };
            mockApiService.post.and.returnValue(of(mockUser));

            service.register(user).subscribe((response) => {
                expect(response).toEqual(mockUser);
            });

            expect(mockApiService.post).toHaveBeenCalledWith('/user', user);
        });
    });

    describe('login', () => {
        it('should call ApiService.post with correct URL and user data', () => {
            const user: UserAuthLogin = {
                email: 'test@example.com',
                password: 'password123',
            };
            const mockUser: User = {
                id: 1,
                username: 'testuser',
                email: 'test@example.com',
                role: 'user',
            };
            mockApiService.post.and.returnValue(of(mockUser));

            service.login(user).subscribe((response) => {
                expect(response).toEqual(mockUser);
            });

            expect(mockApiService.post).toHaveBeenCalledWith(
                '/user/login',
                user
            );
        });
    });

    describe('getProjects', () => {
        it('should call ApiService.get with correct URL', () => {
            const userId = 1;
            const mockProjects: ProjectWithRole[] = [
                {
                    id: 1,
                    name: 'Project 1',
                    description: 'Description 1',
                    startDate: '2025-01-01',
                    role: 'Developer',
                },
            ];
            mockApiService.get.and.returnValue(of(mockProjects));

            service.getProjects(userId).subscribe((projects) => {
                expect(projects).toEqual(mockProjects);
            });

            expect(mockApiService.get).toHaveBeenCalledWith(
                `/user/${userId}/projects`
            );
        });
    });

    describe('getTasks', () => {
        it('should call ApiService.get with correct URL', () => {
            const userId = 1;
            const mockTasks: Task[] = [
                {
                    id: 1,
                    name: 'Task 1',
                    description: 'Task description',
                    priority: 1,
                    dueDate: new Date('2025-12-31'),
                    status: 'Open',
                    users: [
                        {
                            id: 1,
                            username: 'testuser',
                            email: 'test@example.com',
                            role: 'user',
                        },
                    ],
                    comments: [],
                },
            ];
            mockApiService.get.and.returnValue(of(mockTasks));

            service.getTasks(userId).subscribe((tasks) => {
                expect(tasks).toEqual(mockTasks);
            });

            expect(mockApiService.get).toHaveBeenCalledWith(
                `/user/${userId}/tasks`
            );
        });
    });
});
