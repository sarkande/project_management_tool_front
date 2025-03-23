import { User } from './user';
import { Comment } from './comment';
export interface Task {
    id: number;
    name: string;
    description?: string;
    priority: number;
    dueDate?: Date;
    status: string;
    users?: User[];
    comments?: Comment[];
}
