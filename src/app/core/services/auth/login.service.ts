import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environments';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    name: string;
    email: string;
  };
  access_token: string;
  refresh_token: string;
}

@Injectable({
  providedIn: 'root'
})

export class LoginService {
  private apiUrl = `${environment.apiUrl}/login/`;

  constructor(private http: HttpClient) {}

  loginUser(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl, data);
  }

}
