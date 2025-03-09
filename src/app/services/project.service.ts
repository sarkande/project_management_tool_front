import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { Project } from '../interfaces/project';

@Injectable({
    providedIn: 'root',
})
export class ProjectService {
    constructor(private apiService: ApiService) {}

    createProject(projectData: Project, userId: number): Observable<any> {
        return this.apiService.post('/project?userId=' + userId, projectData);
    }

    getProject(projectId: number): Observable<Project> {
        return this.apiService.get('/project/' + projectId);
    }

    getUsersByProject(projectId: number): Observable<any> {
        return this.apiService.get('/project/' + projectId + '/users');
    }
}
