import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { User } from '../../interfaces/user';
import { Task } from '../../interfaces/task';
import { provideRouter } from '@angular/router';

describe('DashboardComponent', () => {
    let component: DashboardComponent;
    let fixture: ComponentFixture<DashboardComponent>;
    let mockAuthService: jasmine.SpyObj<AuthService>;
    let mockUserService: jasmine.SpyObj<UserService>;
    let mockRouter: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        mockAuthService = jasmine.createSpyObj(
            'AuthService',
            ['isLoggedIn', 'logout'],
            { user: null }
        );
        mockUserService = jasmine.createSpyObj('UserService', ['getTasks']);
        mockRouter = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [DashboardComponent],
            providers: [
                { provide: AuthService, useValue: mockAuthService },
                { provide: UserService, useValue: mockUserService },
                { provide: Router, useValue: mockRouter },
                provideRouter([]),
                { provide: 'API_BASE_URL', useValue: 'http://localhost:3000' },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DashboardComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
        it('should logout if user is not logged in', () => {
            mockAuthService.isLoggedIn.and.returnValue(false);
            component.ngOnInit();
            expect(mockAuthService.logout).toHaveBeenCalled();
        });

        it('should set user and fetch tasks if user is logged in', () => {
            const mockUser: User = {
                id: 1,
                username: 'testuser',
                email: 'test@example.com',
            };
            const mockTasks: Task[] = [
                { id: 1, name: 'Task 1', priority: 1, status: 'Open' },
                { id: 2, name: 'Task 2', priority: 2, status: 'Completed' },
            ];

            mockAuthService.isLoggedIn.and.returnValue(true);
            Object.defineProperty(mockAuthService, 'user', { value: mockUser });
            mockUserService.getTasks.and.returnValue(of(mockTasks));

            component.ngOnInit();

            expect(component.user).toEqual(mockUser);
            expect(component.tasks).toEqual(mockTasks);
            expect(mockUserService.getTasks).toHaveBeenCalledWith(mockUser.id);
        });
    });

    describe('logout', () => {
        it('should call AuthService.logout', () => {
            component.logout();
            expect(mockAuthService.logout).toHaveBeenCalled();
        });
    });

    describe('navigateToProjectList', () => {
        it('should navigate to /projects', () => {
            component.navigateToProjectList();
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/projects']);
        });
    });

    describe('extractStatuses', () => {
        it('should extract unique statuses from tasks', () => {
            component.tasks = [
                { id: 1, name: 'Task 1', priority: 1, status: 'Open' },
                { id: 2, name: 'Task 2', priority: 2, status: 'Completed' },
                { id: 3, name: 'Task 3', priority: 3, status: 'Open' },
            ];

            component.extractStatuses();

            expect(component.statuses.size).toBe(2);
            expect(component.statuses.has('Open')).toBeTrue();
            expect(component.statuses.has('Completed')).toBeTrue();
        });
    });
});
