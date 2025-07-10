import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export class BaseHttpService<T> {

  constructor(protected http: HttpClient, private apiUrl: string) { }

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.apiUrl);
  }
  getById(id: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${id}`);
  }
  create(item: T): Observable<T> {
    return this.http.post<T>(this.apiUrl, item);
  }
  update(id: string, item: T): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${id}`, item);
  }
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}


