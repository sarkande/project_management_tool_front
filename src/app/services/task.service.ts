import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Task } from '../interfaces/task';
import { Observable } from 'rxjs';
import { TaskForm } from '../interfaces/task-form';

@Injectable({
    providedIn: 'root',
})
export class TaskService {
    constructor(private apiService: ApiService) {}

    

    getTasks(projectId: number): Observable<Task[]> {
        return this.apiService.get(`/project/${projectId}/tasks`);
    }
    postTask(projectId: number, task: TaskForm): Observable<Task> {
        return this.apiService.post(`/project/${projectId}/task`, task);
    }

    getTask(projectId: number, taskId: number): Observable<Task> {
        return this.apiService.get(`/project/${projectId}/task/${taskId}`);
    }

    updatePartialTask(
        projectId: number,
        taskId: number,
        task: TaskForm
    ): Observable<void> {
        return this.apiService.patch(
            `/project/${projectId}/task/${taskId}`,
            task
        );
    }
    ///post project/{projectId}/task/{taskId}/user
    addUserToTask(
        projectId: number,
        taskId: number,
        email: string
    ): Observable<number> {
        return this.apiService.post(
            `/project/${projectId}/task/${taskId}/user?email=${email}`,
            {}
        );
    }
}
