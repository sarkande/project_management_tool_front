import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
export const HomeGuard: CanActivateFn = (route, state) => {
    const auth = inject(AuthService);
    const router = inject(Router);
    if (auth.isLoggedIn()) {
        router.navigate(['/dashboard']);
        return false;
    }
    return true;
};
