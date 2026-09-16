import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environments';

export interface RegisterRequest {
  email: string;
  password: string;
  confirm_password: string;
}

export interface RegisterResponse {
  user: {
    id: number;
    name: string;
    email: string;
  };
  access_token: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  postRegister(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register/`, data);
  }

}
