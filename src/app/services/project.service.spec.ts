import { TestBed } from '@angular/core/testing';
import { ProjectService } from './project.service';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ApiService } from './api.service';

describe('ProjectService', () => {
    let service: ProjectService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ProjectService,
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
                ApiService,
            ],
        });
        service = TestBed.inject(ProjectService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
