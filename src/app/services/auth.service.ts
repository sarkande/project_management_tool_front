import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { UserAuthResponse } from '../interfaces/user-auth-response';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { UserAuthLogin } from '../interfaces/user-auth-login';
import { StorageService } from './storage.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private currentUserSubject = new BehaviorSubject<UserAuthResponse | null>(
        null
    );

    constructor(
        private userService: UserService,
        private storageService: StorageService
    ) {
        const storedUser = this.storageService.getItem('currentUser');
        if (storedUser) {
            this.currentUserSubject.next(JSON.parse(storedUser));
        }
    }

    public get user(): UserAuthResponse | null {
        return this.currentUserSubject.value;
    }

    login(loginData: UserAuthLogin): Observable<UserAuthResponse> {
        return this.userService.login(loginData).pipe(
            tap((user: UserAuthResponse) => {
                this.storageService.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
            }),
            catchError((error) => {
                // Propager l'erreur pour un traitement ultérieur
                return throwError(() => error);
            })
        );
    }
    logout(): void {
        this.storageService.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    isLoggedIn(): boolean {
        return !!this.user;
    }
}
