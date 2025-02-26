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

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
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
            const formValue = {
                username: this.registerForm.value.username?.trim(),
                email: this.registerForm.value.email?.trim(),
                password: this.registerForm.value.password?.trim(),
            };

            // Envoyer formValue au backend
            console.log('Inscription valide:', formValue);
        }
    }
}
