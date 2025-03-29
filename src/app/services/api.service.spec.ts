import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    private baseUrl = 'http://localhost:8080'; // Assurez-vous que c'est correct

    constructor(private http: HttpClient) {}

    get(url: string): Observable<any> {
        return this.http.get(`${this.baseUrl}${url}`).pipe(
            catchError(this.handleError) // Utilisation de la méthode de gestion d'erreur
        );
    }

    post(url: string, body: any): Observable<any> {
        return this.http
            .post(`${this.baseUrl}${url}`, body)
            .pipe(catchError(this.handleError));
    }

    put(url: string, body: any): Observable<any> {
        return this.http
            .put(`${this.baseUrl}${url}`, body)
            .pipe(catchError(this.handleError));
    }

    patch(url: string, body: any): Observable<any> {
        return this.http
            .patch(`${this.baseUrl}${url}`, body)
            .pipe(catchError(this.handleError));
    }

    delete(url: string): Observable<any> {
        return this.http
            .delete(`${this.baseUrl}${url}`)
            .pipe(catchError(this.handleError));
    }

    // Méthode de gestion d'erreur
    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // Erreur côté client ou erreur réseau
            console.error('An error occurred:', error.error.message);
        } else {
            // Le backend a renvoyé une réponse d'erreur
            console.error(
                `Backend returned code ${error.status}, ` +
                    `body was: ${JSON.stringify(error.error)}`
            ); // Log du corps de l'erreur
        }
        // Retourner un Observable avec le corps de l'erreur pour que les tests puissent le vérifier
        return throwError(() => error); // Retourne l'erreur entière pour le test
    }
}
