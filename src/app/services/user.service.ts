import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { UserRegister } from '../interfaces/user-register';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { UserAuthLogin } from '../interfaces/user-auth-login';
import { ProjectWithRole } from '../interfaces/project-with-role';
import { Task } from '../interfaces/task';
@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(private apiService: ApiService) {}

    register(user: UserRegister): Observable<User> {
        return this.apiService.post<User>('/user', user);
    }

    login(user: UserAuthLogin): Observable<User> {
        return this.apiService.post<User>('/user/login', user);
    }
    getProjects(id: Number): Observable<ProjectWithRole[]> {
        return this.apiService.get<ProjectWithRole[]>(
            '/user/' + id + '/projects'
        );
    }
    getTasks(id: Number): Observable<Task[]> {
        return this.apiService.get<Task[]>('/user/' + id + '/tasks');
    }
}
