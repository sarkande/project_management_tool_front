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
});
