import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { User } from '../../interfaces/user';
import { Router } from '@angular/router';
import { Task } from '../../interfaces/task';
import { UserService } from '../../services/user.service';
import { FilterTasksPipe } from '../../pipes/filter-tasks.pipe';
import { StarRatingComponent } from '../../components/star-rating/star-rating.component';
import { TranslateStatusPipe } from '../../pipes/translate-status.pipe';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, FilterTasksPipe, StarRatingComponent, TranslateStatusPipe],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
    constructor(
        private authService: AuthService,
        private router: Router,
        private userService: UserService
    ) {}
    user!: User | null;

    tasks: Task[] = [];
    statuses: Set<string> = new Set();

    ngOnInit(): void {
        if (!this.authService.isLoggedIn()) this.authService.logout();

        this.user = this.authService.user;
        if (!this.user) return;

        // Get all tasks for the current user
        this.userService.getTasks(this.user.id).subscribe({
            next: (tasks) => {
                this.tasks = tasks;
                //Filter non tasks
                this.tasks = this.tasks.filter(
                    (task) => typeof task !== 'number'
                );

                this.extractStatuses();
            },
            error: (error) => {
                console.error('Error:', error);
            },
        });
    }

    logout() {
        this.authService.logout();
    }

    navigateToProjectList() {
        this.router.navigate(['/projects']);
    }

    extractStatuses() {
        this.tasks.forEach((task) => {
            this.statuses.add(task.status);
        });
    }
}
