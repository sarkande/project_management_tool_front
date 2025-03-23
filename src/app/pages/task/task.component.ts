import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task } from '../../interfaces/task';
import { StarRatingComponent } from '../../components/star-rating/star-rating.component';

@Component({
    selector: 'app-task',
    standalone: true,
    imports: [RouterModule, CommonModule, StarRatingComponent],
    templateUrl: './task.component.html',
    styleUrl: './task.component.scss',
})
export class TaskComponent implements OnInit {
    task!: Task ;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private taskService: TaskService
    ) {}
    ngOnInit(): void {
        //Get the id from the route -> project id
        if (!this.route.snapshot.params['id']) {
            return;
        }
        const projectId = this.route.snapshot.params['id'];
        //Get the id from the route -> task id

        if (!this.route.snapshot.params['taskId']) {
            return;
        }
        const taskId = this.route.snapshot.params['taskId'];

        //Get the data for this task
        this.taskService.getTask(projectId, taskId).subscribe({
            next: (task) => {
                console.log('Task:', task);
                this.task = task;
            },
            error: (error) => {
                console.error('Error:', error);
            },
        });
    }
}
