import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../product-list/product';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://localhost:7202/api/Product'; // Replace with your API URL

  constructor(private http: HttpClient) { }
  getProducts(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
