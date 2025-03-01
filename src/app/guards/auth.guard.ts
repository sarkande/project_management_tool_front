import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AuthGuard: CanActivateFn = (route, state) => {
    const auth = inject(AuthService);
    const router = inject(Router);
    console.log('AuthGuard:', auth.isLoggedIn());
    if (!auth.isLoggedIn()) {
        router.navigate(['/']);
        return false;
    }
    return true;
};
