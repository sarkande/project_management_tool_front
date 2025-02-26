import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild, ElementRef } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { UserService } from '../../services/user.service';

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

    constructor(private userService:UserService) {}

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
            // Envoyer les données au backend
            console.log('Formulaire valide:', this.loginForm.value);

            this.userService.login(this.loginForm.value).subscribe({
                next: (user) => {
                    console.log('Utilisateur connecté:', user);
                },
                error: (error) => {
                    console.error('Erreur de connexion:', error);
                },
            });
        }
    }
}
