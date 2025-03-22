import { User } from './user';

export interface TaskForm {
    id?: number;
    name: string;
    description?: string;
    priority: number;
    dueDate?: Date;
    status: string;
    users?: User[];
}
