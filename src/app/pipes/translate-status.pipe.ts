import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'translateStatus',
    standalone: true,
})
export class TranslateStatusPipe implements PipeTransform {
    transform(value: string): string {
        switch (value.toLowerCase()) {
            case 'pending':
                return 'En attente';
            case 'in_progress':
                return 'En cours';
            case 'done':
                return 'Terminé';
            default:
                return value;
        }
    }
}
