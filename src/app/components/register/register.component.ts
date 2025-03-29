import { Component } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
    AbstractControl,
    ValidationErrors,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { of } from 'rxjs';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
    serverError: String = '';
    serverSuccess: String = '';

    isProcessing: boolean = false;

    constructor(private userService: UserService) {}

    registerForm = new FormGroup(
        {
            username: new FormControl('', [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(50),
            ]),
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [
                Validators.required,
                Validators.minLength(8),
            ]),
            confirmPassword: new FormControl('', [Validators.required]),
        },
        { validators: this.passwordMatchValidator }
    );

    passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
        const password = control.get('password')?.value;
        const confirmPassword = control.get('confirmPassword')?.value;
        return password === confirmPassword ? null : { mismatch: true };
    }

    onSubmit() {
        if (this.registerForm.valid) {
            this.isProcessing = true;
            this.serverError = '';
            this.serverSuccess = '';

            const formValue = {
                username: this.registerForm.value.username!.trim(),
                email: this.registerForm.value.email!.trim(),
                password: this.registerForm.value.password!.trim(),
            };

            // Envoyer formValue au backend
            this.userService.register(formValue).subscribe({
                next: (user) => {
                    this.serverSuccess = 'Inscription réussie';
                },
                error: (err) => {
                    console.error("Erreur lors de l'inscription:", err);
                    this.isProcessing = false;

                    // Exemple de gestion d'erreur détaillée
                    if (err.status === 409) {
                        this.serverError = 'Cet email est déjà utilisé';
                    } else if (err.status === 0) {
                        this.serverError =
                            'Impossible de se connecter au serveur';
                    } else {
                        this.serverError = 'Une erreur inattendue est survenue';
                    }
                },
                complete: () => {
                },
            });
        }
    }
}
