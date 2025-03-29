import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormTaskComponent } from './form-task.component';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('FormTaskComponent', () => {
    let component: FormTaskComponent;
    let fixture: ComponentFixture<FormTaskComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FormTaskComponent],
            providers: [
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
                provideRouter([]),
                { provide: 'API_BASE_URL', useValue: 'http://localhost:3000' },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(FormTaskComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
