import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild, ElementRef } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserAuthLogin } from '../../interfaces/user-auth-login';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent implements AfterViewInit {
    @ViewChild('email') email!: ElementRef<HTMLInputElement>;
    @ViewChild('password') password!: ElementRef<HTMLInputElement>;
    error = '';
    constructor(private authService: AuthService, private router: Router) {}

    //Login form for validators
    loginForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [
            Validators.required,
            Validators.minLength(8),
        ]),
    });

    ngAfterViewInit(): void {
        console.log('Email input:', this.email.nativeElement);
        setTimeout(() => {
            // this.email.nativeElement.focus();
        }, 2000);
    }
    onSubmit() {
        if (this.loginForm.valid) {
            this.error = '';
            // Envoyer les données au backend
            console.log('Formulaire valide:', this.loginForm.value);
            const loginData: UserAuthLogin = {
                email: this.loginForm.value.email!, // L'opérateur '!' indique que 'email' et 'password' ne sont pas null ni undefined
                password: this.loginForm.value.password!,
            };
            this.authService.login(loginData).subscribe({
                next: (user) => {
                    console.log('Utilisateur connecté:', user);
                    //Redirect to dashboard
                    //Activate guard
                    this.router.navigate(['/dashboard']);
                },
                error: (error) => {
                    console.error('Erreur de connexion:', error);

                    switch (error.status) {
                        case 0:
                            this.error = 'Serveur injoignable';
                            break;
                        case 401:
                            this.error = 'Email ou mot de passe incorrect';
                            break;
                        default:
                            this.error = 'Erreur interne du serveur';
                            break;
                    }
                },
            });
        }
    }
}
