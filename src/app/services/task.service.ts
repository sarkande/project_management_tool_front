import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Task } from '../interfaces/task';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private apiService:ApiService) { }

  getTasks(projectId: number): Observable<Task[]> {
    return this.apiService.get(`/project/${projectId}/tasks`);
  }
}
