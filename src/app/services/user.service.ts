import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { UserRegister } from '../interfaces/user-register';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { UserAuthLogin } from '../interfaces/user-auth-login';
import { Project } from '../interfaces/project';
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
    getProjects(id: Number): Observable<Project> {
        return this.apiService.get<Project>('/user/' + id + '/projects');
    }
}
