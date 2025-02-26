import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { HOMEComponent } from './home.component';

describe('HOMEComponent', () => {
    let component: HOMEComponent;
    let fixture: ComponentFixture<HOMEComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HOMEComponent],
            providers: [provideHttpClientTesting()],
        }).compileComponents();

        fixture = TestBed.createComponent(HOMEComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
