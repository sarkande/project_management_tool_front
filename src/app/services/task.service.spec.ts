import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';

describe('TaskService', () => {
    let service: TaskService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                TaskService,
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
                ApiService,
            ],
        });

        service = TestBed.inject(TaskService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify(); // Vérifie qu'il n'y a pas de requêtes en suspens
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    // Ajoutez d'autres tests ici
});
