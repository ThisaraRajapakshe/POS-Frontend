import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export class BaseHttpService<T, TCreateDto = T, TUpdateDto = T> {

  constructor(protected http: HttpClient, private apiUrl: string) { }

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.apiUrl);
  }
  getById(id: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${id}`);
  }
  create(dto: TCreateDto): Observable<T> {
    return this.http.post<T>(this.apiUrl, dto);
  }
  update(id: string, dto: TUpdateDto): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${id}`, dto);
  }
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}


