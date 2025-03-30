import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

describe('StorageService', () => {
    let service: StorageService;
    let platformId: Object;

    beforeEach(() => {
        platformId = 'browser'; 

        TestBed.configureTestingModule({
            providers: [{ provide: PLATFORM_ID, useValue: platformId }],
        });

        service = TestBed.inject(StorageService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('setItem', () => {
        it('should store item in localStorage when in browser', () => {
            spyOn(localStorage, 'setItem');
            const key = 'testKey';
            const value = { data: 'testData' };

            service.setItem(key, value);

            expect(localStorage.setItem).toHaveBeenCalledWith(
                key,
                JSON.stringify(value)
            );
        });
    });

    describe('getItem', () => {
        it('should retrieve item from localStorage when in browser', () => {
            const key = 'testKey';
            const storedValue = { data: 'testData' };
            spyOn(localStorage, 'getItem').and.returnValue(
                JSON.stringify(storedValue)
            );

            const result = service.getItem(key);

            expect(localStorage.getItem).toHaveBeenCalledWith(key);
            expect(result).toEqual(storedValue);
        });

        it('should return null if item does not exist in localStorage', () => {
            const key = 'nonExistingKey';
            spyOn(localStorage, 'getItem').and.returnValue(null);

            const result = service.getItem(key);

            expect(localStorage.getItem).toHaveBeenCalledWith(key);
            expect(result).toBeNull();
        });
    });

    describe('removeItem', () => {
        it('should remove item from localStorage when in browser', () => {
            spyOn(localStorage, 'removeItem');
            const key = 'testKey';

            service.removeItem(key);

            expect(localStorage.removeItem).toHaveBeenCalledWith(key);
        });
    });
});
