import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../interfaces/task';

@Pipe({
    name: 'filterTasks',
    standalone: true,
})
export class FilterTasksPipe implements PipeTransform {
    transform(tasks: Task[], status: string): Task[] {
        return tasks.filter((task) => task.status === status);
    }
}
