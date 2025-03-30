import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HOMEComponent } from './home.component';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('HOMEComponent', () => {
    let component: HOMEComponent;
    let fixture: ComponentFixture<HOMEComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HOMEComponent],
            providers: [
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(HOMEComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should show login form by default', () => {
        expect(component.isLoginVisible).toBeTrue();
        expect(component.isRegisterVisible).toBeFalse();
    });

    it('should show register form when openForm is called with "register"', () => {
        component.openForm('register');
        expect(component.isRegisterVisible).toBeTrue();
        expect(component.isLoginVisible).toBeFalse();
    });

    it('should show login form when openForm is called with "login"', () => {
        component.openForm('register'); // first switch to register
        component.openForm('login'); // then switch back to login
        expect(component.isLoginVisible).toBeTrue();
        expect(component.isRegisterVisible).toBeFalse();
    });

    it('should toggle visibility correctly when setting isLoginVisible', () => {
        component.isLoginVisible = false;
        expect(component.isLoginVisible).toBeFalse();
        expect(component.isRegisterVisible).toBeTrue();

        component.isLoginVisible = true;
        expect(component.isLoginVisible).toBeTrue();
        expect(component.isRegisterVisible).toBeFalse();
    });

    it('should toggle visibility correctly when setting isRegisterVisible', () => {
        component.isRegisterVisible = true;
        expect(component.isRegisterVisible).toBeTrue();
        expect(component.isLoginVisible).toBeFalse();

        component.isRegisterVisible = false;
        expect(component.isRegisterVisible).toBeFalse();
        expect(component.isLoginVisible).toBeTrue();
    });
});
