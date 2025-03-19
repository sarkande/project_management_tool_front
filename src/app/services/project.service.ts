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

    //  @PostMapping("/project/{projectId}/adduser")
    // public Integer addUserToProject(@PathVariable Integer projectId, @RequestParam String userMail, @RequestParam String role, @RequestParam Integer currentUser) {
    addUserToProject(projectId: number, userMail: string, role: string, currentUser: number): Observable<number> {
        return this.apiService.post('/project/' + projectId + '/adduser?userMail='+userMail+'&role='+role+'&currentUser='+currentUser, {});
    }
}
