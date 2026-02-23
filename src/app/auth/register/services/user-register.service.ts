import { Injectable, inject } from '@angular/core';
import { addStaffRequestDto } from '../register.models';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserRegisterService {
  private readonly apiUrl = `${environment.apiUrl}/Auth/register`;
  private http = inject(HttpClient);

  registerUser(userData: addStaffRequestDto) {
    return this.http.post(this.apiUrl, userData);

  }
}
