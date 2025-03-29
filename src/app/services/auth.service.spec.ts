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
import { ApiService } from './api.service';

const mockUserService = {
    login: () => ({ pipe: () => ({}) }), 
};

const mockStorageService = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
};

describe('AuthService', () => {
    let service: AuthService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AuthService,
                ApiService,
                { provide: UserService, useValue: mockUserService },
                { provide: StorageService, useValue: mockStorageService },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
                provideRouter([]), 
                provideLocationMocks(), 
            ],
        });

        service = TestBed.inject(AuthService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
