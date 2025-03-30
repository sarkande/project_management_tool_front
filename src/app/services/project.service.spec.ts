import { TestBed } from '@angular/core/testing';
import { ProjectService } from './project.service';
import { ApiService } from './api.service';
import { Project } from '../interfaces/project';
import { of } from 'rxjs';

describe('ProjectService', () => {
    let service: ProjectService;
    let mockApiService: jasmine.SpyObj<ApiService>;

    // Données de test basées sur l'interface Project
    const completeProject: Project = {
        id: 1,
        name: 'Projet Alpha',
        description: 'Description détaillée',
        startDate: '2025-01-01',
    };

    const minimalProject: Project = {
        id: 2,
        name: 'Projet Beta',
    };

    beforeEach(() => {
        mockApiService = jasmine.createSpyObj('ApiService', ['post', 'get']);

        TestBed.configureTestingModule({
            providers: [
                ProjectService,
                { provide: ApiService, useValue: mockApiService },
            ],
        });

        service = TestBed.inject(ProjectService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('createProject', () => {
        it('should send complete project data', () => {
            mockApiService.post.and.returnValue(of({}));

            service.createProject(completeProject, 123).subscribe();

            expect(mockApiService.post).toHaveBeenCalledWith(
                '/project?userId=123',
                completeProject
            );
        });

        it('should handle minimal project data', () => {
            mockApiService.post.and.returnValue(of({}));

            service.createProject(minimalProject, 456).subscribe();

            expect(mockApiService.post).toHaveBeenCalledWith(
                '/project?userId=456',
                jasmine.objectContaining({
                    id: 2,
                    name: 'Projet Beta',
                })
            );
        });
    });

    describe('getProject', () => {
        it('should return complete project data', (done) => {
            mockApiService.get.and.returnValue(of(completeProject));

            service.getProject(1).subscribe((project) => {
                expect(project).toEqual(completeProject);
                expect(project.description).toBeDefined();
                expect(project.startDate).toBeDefined();
                done();
            });
        });

        it('should handle minimal project response', (done) => {
            mockApiService.get.and.returnValue(of(minimalProject));

            service.getProject(2).subscribe((project) => {
                expect(project.description).toBeUndefined();
                expect(project.startDate).toBeUndefined();
                done();
            });
        });
    });

    describe('addUserToProject', () => {
        it('should send request with non-encoded parameters', () => {
            const params = {
                projectId: 3,
                userMail: 'user@domain.com',
                role: 'admin test',
                currentUser: 789,
            };

            mockApiService.post.and.returnValue(of(200));

            service
                .addUserToProject(
                    params.projectId,
                    params.userMail,
                    params.role,
                    params.currentUser
                )
                .subscribe();

            // Version sans encodage
            const expectedUrl =
                `/project/${params.projectId}/adduser?` +
                `userMail=${params.userMail}&` +
                `role=${params.role}&` +
                `currentUser=${params.currentUser}`;

            expect(mockApiService.post).toHaveBeenCalledWith(expectedUrl, {});
        });
    });

    describe('getUsersByProject', () => {
        it('should return users array', (done) => {
            const mockUsers = [
                { id: 1, name: 'Utilisateur 1' },
                { id: 2, name: 'Utilisateur 2' },
            ];

            mockApiService.get.and.returnValue(of(mockUsers));

            service.getUsersByProject(1).subscribe((users) => {
                expect(users.length).toBe(2);
                expect(users[0].name).toBe('Utilisateur 1');
                done();
            });
        });
    });
});
