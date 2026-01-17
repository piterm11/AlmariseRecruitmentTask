import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

export interface ElementDto {
  businessKey: string;
  content: string;
}

@Injectable({ providedIn: 'root' })
export class ElementService {
  private apiUrl = '/api/elements';

  constructor(private http: HttpClient) {}

  create(element: ElementDto): Observable<ElementDto> {
    return this.http.post<ElementDto>(this.apiUrl, element).pipe(
      catchError(this.handleError)
    );
  }

  getByKey(businessKey: string): Observable<ElementDto> {
    return this.http.get<ElementDto>(`${this.apiUrl}/${businessKey}`);
  }

  getAll(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/all`);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 409) {
      return throwError(() => new Error('Element o podanym kluczu już istnieje!'));
    }
    return throwError(() => new Error('Wystąpił nieoczekiwany błąd.'));
  }
}
