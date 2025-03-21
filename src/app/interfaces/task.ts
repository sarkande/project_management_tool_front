import { User } from './user';

export interface Task {
    id?: number;
    name: string;
    description?: string;
    priority: number;
    dueDate?: Date;
    status: string;
    users?: User[];
}
