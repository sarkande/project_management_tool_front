import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { StorageService } from './storage.service';
import { provideRouter } from '@angular/router';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideLocationMocks } from '@angular/common/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { UserAuthResponse } from '../interfaces/user-auth-response';
import { UserAuthLogin } from '../interfaces/user-auth-login';

describe('AuthService', () => {
    let service: AuthService;
    let router: Router;
    let mockUserService: jasmine.SpyObj<UserService>;
    let mockStorageService: jasmine.SpyObj<StorageService>;

    beforeEach(() => {
        // 1. Création des mocks
        mockUserService = jasmine.createSpyObj('UserService', ['login']);
        mockStorageService = jasmine.createSpyObj('StorageService', [
            'getItem',
            'setItem',
            'removeItem',
        ]);

        // 2. Configuration globale du TestBed (sans injection de AuthService)
        TestBed.configureTestingModule({
            providers: [
                AuthService,
                { provide: UserService, useValue: mockUserService },
                { provide: StorageService, useValue: mockStorageService },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
                provideRouter([]),
                provideLocationMocks(),
            ],
        });

        router = TestBed.inject(Router);
        spyOn(router, 'navigate');
    });

    it('should be created', () => {
        service = TestBed.inject(AuthService);
        expect(service).toBeTruthy();
    });

    it('should return true if a user is logged in', () => {
        // Configuration SPÉCIFIQUE au test AVANT injection
        const mockUser: UserAuthResponse = {
            id: 1,
            username: 'testuser',
            email: 'testuser@example.com',
        };
        mockStorageService.getItem.and.returnValue(JSON.stringify(mockUser));

        // Injection APRÈS configuration des mocks
        service = TestBed.inject(AuthService);

        // Vérifications
        expect(service.user).not.toBeNull();
        expect(service.user?.username).toBe('testuser');
        expect(service.isLoggedIn()).toBeTrue();
    });

    it('should return false if no user is logged in', () => {
        // Configuration spécifique
        mockStorageService.getItem.and.returnValue(null);

        // Injection
        service = TestBed.inject(AuthService);

        expect(service.user).toBeNull();
        expect(service.isLoggedIn()).toBeFalse();
    });

    it('should login a user and update storage', (done) => {
        const loginData: UserAuthLogin = {
            email: 'testuser@example.com',
            password: 'password',
        };
        const mockUser: UserAuthResponse = {
            id: 1,
            username: 'testuser',
            email: 'testuser@example.com',
        };

        mockUserService.login.and.returnValue(of(mockUser));
        service = TestBed.inject(AuthService);

        service.login(loginData).subscribe((user) => {
            expect(user).toEqual(mockUser);
            expect(mockStorageService.setItem).toHaveBeenCalledWith(
                'currentUser',
                JSON.stringify(user)
            );
            expect(service.user).toEqual(mockUser);
            done();
        });
    });

    it('should handle login error', (done) => {
        mockUserService.login.and.returnValue(
            throwError(() => new Error('Login failed'))
        );
        const loginData: UserAuthLogin = {
            email: 'testuser@example.com',
            password: 'password',
        };

        service = TestBed.inject(AuthService);

        service.login(loginData).subscribe({
            next: () => fail('Should have failed'),
            error: (error) => {
                expect(error.message).toBe('Login failed');
                done();
            },
        });
    });

    it('should logout a user and clear storage', () => {
        service = TestBed.inject(AuthService);

        // Simule un utilisateur connecté
        const mockUser: UserAuthResponse = {
            id: 1,
            username: 'testuser',
            email: 'testuser@example.com',
        };
        service['currentUserSubject'].next(mockUser);

        service.logout();

        expect(mockStorageService.removeItem).toHaveBeenCalledWith(
            'currentUser'
        );
        expect(service.user).toBeNull();
        expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
});
