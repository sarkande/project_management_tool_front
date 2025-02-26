import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { UserRegister } from '../interfaces/user-register';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { UserLogin } from '../interfaces/user-login';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private apiService: ApiService) { }

  register(user: UserRegister):Observable<User> {
    return this.apiService.post<User>('/user', user);
  }

  login(user: UserLogin):Observable<User> {
    return this.apiService.post<User>('/user/login', user);
  }
}
