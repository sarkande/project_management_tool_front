import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormManageUserProjectComponent } from './form-manage-user-project.component';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('FormManageUserProjectComponent', () => {
    let component: FormManageUserProjectComponent;
    let fixture: ComponentFixture<FormManageUserProjectComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FormManageUserProjectComponent],
            providers: [
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
                provideRouter([]),
                provideAnimations(),
                { provide: 'API_BASE_URL', useValue: 'http://localhost:3000' },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(FormManageUserProjectComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
