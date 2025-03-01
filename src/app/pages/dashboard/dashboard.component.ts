import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
    constructor(
        private authService: AuthService,
        private userService: UserService,
        private projectService: ProjectService
    ) {}

    ngOnInit(): void {
        if (!this.authService.isLoggedIn()) this.authService.logout();

        let user = this.authService.user;
        if (!user) return;

        this.userService.getProjects(user.id).subscribe({
            next: (projects) => {
                console.log('Projects:', projects);
            },
            error: (error) => {
                console.log('Error:', error);
            },
        });
    }

    logout() {
        this.authService.logout();
    }
}
