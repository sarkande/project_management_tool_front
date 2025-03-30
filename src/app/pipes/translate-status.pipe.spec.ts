import { TranslateStatusPipe } from './translate-status.pipe';

describe('TranslateStatusPipe', () => {
    let pipe: TranslateStatusPipe;

    beforeEach(() => {
        pipe = new TranslateStatusPipe();
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should translate "pending" to "En attente"', () => {
        expect(pipe.transform('pending')).toBe('En attente');
    });

    it('should translate "in_progress" to "En cours"', () => {
        expect(pipe.transform('in_progress')).toBe('En cours');
    });

    it('should translate "done" to "Terminé"', () => {
        expect(pipe.transform('done')).toBe('Terminé');
    });

    it('should return the original value if no translation is found', () => {
        const originalValue = 'unknown_status';
        expect(pipe.transform(originalValue)).toBe(originalValue);
    });

    it('should handle case insensitivity', () => {
        expect(pipe.transform('PENDING')).toBe('En attente');
        expect(pipe.transform('In_Progress')).toBe('En cours');
        expect(pipe.transform('DONE')).toBe('Terminé');
    });
});
