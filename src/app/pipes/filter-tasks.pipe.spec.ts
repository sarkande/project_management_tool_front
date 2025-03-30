import { FilterTasksPipe } from './filter-tasks.pipe';
import { Task } from '../interfaces/task';

describe('FilterTasksPipe', () => {
    let pipe: FilterTasksPipe;

    beforeEach(() => {
        pipe = new FilterTasksPipe();
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should filter tasks by status', () => {
        const tasks: Task[] = [
            { id: 1, name: 'Task 1', priority: 1, status: 'Open' },
            { id: 2, name: 'Task 2', priority: 2, status: 'Completed' },
            { id: 3, name: 'Task 3', priority: 3, status: 'Open' },
        ];

        const filteredTasks = pipe.transform(tasks, 'Open');

        expect(filteredTasks.length).toBe(2);
        expect(filteredTasks).toEqual([
            { id: 1, name: 'Task 1', priority: 1, status: 'Open' },
            { id: 3, name: 'Task 3', priority: 3, status: 'Open' },
        ]);
    });

    it('should return an empty array if no tasks match the status', () => {
        const tasks: Task[] = [
            { id: 1, name: 'Task 1', priority: 1, status: 'Open' },
            { id: 2, name: 'Task 2', priority: 2, status: 'Completed' },
        ];

        const filteredTasks = pipe.transform(tasks, 'In Progress');

        expect(filteredTasks.length).toBe(0);
        expect(filteredTasks).toEqual([]);
    });

});
