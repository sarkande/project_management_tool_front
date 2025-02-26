import { Component } from '@angular/core';
import { RegisterComponent } from '../../components/register/register.component';
import { LoginComponent } from '../../components/login/login.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RegisterComponent, LoginComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
})
export class HOMEComponent {
    _isLoginVisible = true;
    _isRegisterVisible = false;

    openForm(formType: string) {
        if (formType === 'login') this.isLoginVisible = true;
        else if (formType === 'register') this.isRegisterVisible = true;
    }

    set isLoginVisible(value: boolean) {
        this._isLoginVisible = value;
        this._isRegisterVisible = !value;
    }
    set isRegisterVisible(value: boolean) {
        this._isRegisterVisible = value;
        this._isLoginVisible = !value;
    }
    get isLoginVisible() {
        return this._isLoginVisible;
    }
    get isRegisterVisible() {
        return this._isRegisterVisible;
    }
}
