import { Project } from './project';

export interface ProjectWithRole {
    id: number;
    name: string;
    description?: string;
    startDate?: string;
    role: string;
}
