import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import {
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    UrlTree,
} from '@angular/router';

describe('AuthGuard', () => {
    let authServiceMock: jasmine.SpyObj<AuthService>;
    let routerMock: jasmine.SpyObj<Router>;
    let mockRoute: ActivatedRouteSnapshot;
    let mockState: RouterStateSnapshot;

    beforeEach(() => {
        authServiceMock = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
        routerMock = jasmine.createSpyObj('Router', [
            'navigate',
            'createUrlTree',
        ]);

        mockRoute = {} as ActivatedRouteSnapshot;
        mockState = {} as RouterStateSnapshot;

        TestBed.configureTestingModule({
            providers: [
                { provide: AuthService, useValue: authServiceMock },
                { provide: Router, useValue: routerMock },
            ],
        });
    });

    it('should allow the authenticated user to activate the route', () => {
        authServiceMock.isLoggedIn.and.returnValue(true);

        const result = TestBed.runInInjectionContext(() =>
            AuthGuard(mockRoute, mockState)
        );

        expect(result).toBeTrue();
        expect(routerMock.navigate).not.toHaveBeenCalled();
    });
    it('should not allow the authenticated user to activate the route', () => {
        authServiceMock.isLoggedIn.and.returnValue(false);
        const urlTree = {} as UrlTree;
        routerMock.createUrlTree.and.returnValue(urlTree);

        const result = TestBed.runInInjectionContext(() =>
            AuthGuard(mockRoute, mockState)
        );

        expect(result).toBeFalse();
        expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
    });
});
